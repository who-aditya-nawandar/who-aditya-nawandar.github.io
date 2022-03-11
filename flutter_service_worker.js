'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "3fb385a06b77667ea2402fd1ba06f56d",
"index.html": "a2deb8d49784b54b6b37507bbb7952fd",
"/": "a2deb8d49784b54b6b37507bbb7952fd",
"main.dart.js": "1035e8b105e99187833d6f5958862137",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "e0fde081cbecc5d1072651221771b4cc",
"assets/AssetManifest.json": "050373db94b877c6cf56e87705c1a4fb",
"assets/NOTICES": "67d46081c94b96f2dbfe1575e4eb9022",
"assets/FontManifest.json": "75e29ded2d32826a000f0df4f1ee6e3f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/typicons_flutter/fonts/typicons.ttf": "29f9630f7d87a79830d1c321e1600f2e",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/assets/images/3d_demo/3D_ss1.gif": "f62b4282d157a3b6b1a2ef700f3339df",
"assets/assets/images/workout_tracker/workout_tracker_png.png": "eba8e1b48c4cebe89368467f533bd8a4",
"assets/assets/images/workout_tracker/SWT_ss1.png": "368a4a7998f78ef0c5675e72e1e20c77",
"assets/assets/images/workout_tracker/SWT_ss2.png": "c3d2dbb8813a41b252341df960a0d071",
"assets/assets/images/sound_recorder/SR_ss1.png": "ceb65cdbc1fd42939bff0744a82de63b",
"assets/assets/images/sound_recorder/SR_ss2.gif": "2fd358c88575cc741cd30d6b831c3a29",
"assets/assets/images/food_nutrition/FN_ss2.png": "2495c61c6133ddb20e141067b9d1eff4",
"assets/assets/images/food_nutrition/FN_ss1.png": "316f97b4e45d5a65995ae6c3a24577d1",
"assets/assets/images/food_nutrition/FN_ss.png": "f17c2619d907c56eade09049d9cddc1f",
"assets/assets/fonts/stencil-army/StencilArmyWWI.ttf": "d3bc7934c1c6614b5a53a51e6fe79e21",
"assets/assets/fonts/post-no-bills/postnobillscolombo-medium.ttf": "a1688f5706e290c83900f91cb4ce3287",
"assets/assets/fonts/post-no-bills/postnobillscolombo-regular.ttf": "e5a2165117ba2991cf0563f4370f2e9a",
"assets/assets/fonts/post-no-bills/postnobillscolombo-semibold.ttf": "bf7d89a6e47dc08c65a9e6d6849cad57",
"assets/assets/fonts/post-no-bills/postnobillscolombo-extrabold.ttf": "ef787e7e1707cc556b4e3402f59dcb7a",
"assets/assets/fonts/crafto-stencil/NewFont-Regular.otf": "e72620f72430c4e9ddc599be767b405a",
"assets/assets/fonts/Lintsec.ttf": "7269bae37201bab2ba553412c3208a5b",
"assets/assets/fonts/mute-fruit-font/MUTEFRUIT.ttf": "d231fbc112f06109bfff3bd22fa12e58",
"assets/assets/fonts/slabgraph-font/Slabgraph.otf": "1b4048cc9eb08863d35b5d7f3833de85",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
