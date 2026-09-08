// Phase 5.5 pilot (issue #6): curb-cut-aware pedestrian routing prototype.
//
// Scope: proves the concept over ONE pilot cluster (Restauradores, central
// Lisbon) using real OSM sidewalk/kerb data — not wired into the main app UI.
// Data snapshot lives in sidewalk_pilot_data.json (footway/pedestrian ways,
// Overpass "out geom") and sidewalk_pilot_kerbs.json (kerb + crossing nodes,
// same OSM node IDs so they line up with the way vertex lists).
//
// A raised kerb at a crossing is the one thing generic routers (Google Maps,
// Citymapper) don't model: it can make an otherwise-shortest path impassable
// for a wheelchair user. This graph penalizes raised kerbs heavily rather
// than excluding them outright, since "penalized" beats "silently assumed
// fine" per the app's honest-labeling principle — an unknown kerb is treated
// as passable-but-unscored, not as a hard block, since most nodes have no
// kerb tag at all and blocking on absence of data would make the graph unusable.

import createGraph from 'ngraph.graph';
import path from 'ngraph.path';

const RAISED_KERB_PENALTY = 20; // multiplies effective segment length at a raised-kerb node

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Builds an ngraph graph from Overpass "out geom" ways plus a kerb/crossing
// node lookup. Way geometry has no stable node IDs in the geometry array
// itself, so we key vertices by rounded lat/lon instead of matching the
// separate `nodes` id list — good enough at pilot scale, and avoids needing
// two aligned Overpass calls to agree on ID ordering.
function buildSidewalkGraph(ways, kerbNodes) {
  const graph = createGraph();
  const kerbByCoord = new Map();
  for (const node of kerbNodes) {
    const key = coordKey(node.lat, node.lon);
    kerbByCoord.set(key, node.tags.kerb || null);
  }

  for (const way of ways) {
    const geom = way.geometry || [];
    for (let i = 0; i < geom.length - 1; i++) {
      const a = geom[i];
      const b = geom[i + 1];
      const aKey = coordKey(a.lat, a.lon);
      const bKey = coordKey(b.lat, b.lon);

      graph.addNode(aKey, a);
      graph.addNode(bKey, b);

      const dist = haversine(a.lat, a.lon, b.lat, b.lon);
      const kerbAtB = kerbByCoord.get(bKey);
      const weight = kerbAtB === 'raised' ? dist * RAISED_KERB_PENALTY : dist;

      graph.addLink(aKey, bKey, { weight });
      graph.addLink(bKey, aKey, { weight });
    }
  }
  return graph;
}

function coordKey(lat, lon) {
  return `${lat.toFixed(6)},${lon.toFixed(6)}`;
}

function nearestNode(graph, lat, lon) {
  let best = null;
  let bestDist = Infinity;
  graph.forEachNode((node) => {
    const d = haversine(lat, lon, node.data.lat, node.data.lon);
    if (d < bestDist) {
      bestDist = d;
      best = node.id;
    }
  });
  return best;
}

function findAccessiblePath(graph, fromLatLon, toLatLon) {
  const pathFinder = path.aStar(graph, {
    distance(fromNode, toNode, link) {
      return link.data.weight;
    },
    heuristic(fromNode, toNode) {
      return haversine(fromNode.data.lat, fromNode.data.lon, toNode.data.lat, toNode.data.lon);
    },
  });

  const fromId = nearestNode(graph, fromLatLon.lat, fromLatLon.lon);
  const toId = nearestNode(graph, toLatLon.lat, toLatLon.lon);
  if (fromId === null || toId === null) return null;

  const found = pathFinder.find(fromId, toId);
  if (!found.length) return null;

  // ngraph returns target-to-source; reverse to source-to-target.
  return found.reverse().map((node) => ({ lat: node.data.lat, lon: node.data.lon }));
}

export { buildSidewalkGraph, findAccessiblePath, haversine };
