<template>
  <div>
    <div id="container"></div>

    <div id="currentInfo">
      <span id="year1990" class="year">1990</span>
      <span id="year1995" class="year">1995</span>
      <span id="year2000" class="year">2000</span>
    </div>

  </div>
</template>

<script>
import * as THREE from 'three';

export default {
  data() {
    return {
      years: ['1990', '1995', '2000'],
      lat: 'start',
      long: 'start',
      t2017: [],
      t2018: [],
      mapData: [],
    }
  },
  methods: {
    initGlobe(imageLoad) {

      var DAT = DAT || {};

      DAT.Globe = function(container, opts) {
        opts = opts || {};

        const colorFn = opts.colorFn || function(x) {
          let c = new THREE.Color();
          c.setHSL((0.6 - (x * 0.35)), 1.0, 0.5);
          return c;
        };

        const Shaders = {
          'earth': {
            uniforms: {
              'texture': { type: 't', value: null }
            },
            vertexShader: [
              'varying vec3 vNormal;',
              'varying vec2 vUv;',
              'void main() {',
              'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
              'vNormal = normalize( normalMatrix * normal );',
              'vUv = uv;',
              '}'
            ].join('\n'),
            fragmentShader: [
              'uniform sampler2D texture;',
              'varying vec3 vNormal;',
              'varying vec2 vUv;',
              'void main() {',
              'vec3 diffuse = texture2D( texture, vUv ).xyz;',
              'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
              'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
              'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
              '}'
            ].join('\n')
          },
          'atmosphere': {
            uniforms: {},
            vertexShader: [
              'varying vec3 vNormal;',
              'void main() {',
              'vNormal = normalize( normalMatrix * normal );',
              'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
              '}'
            ].join('\n'),
            fragmentShader: [
              'varying vec3 vNormal;',
              'void main() {',
              'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
              'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
              '}'
            ].join('\n')
          }
        };

        let camera, scene, renderer, w, h, mesh, atmosphere, point, overRenderer,
          distance = 100000,
          distanceTarget = 100000,
          mouse = { x: 0, y: 0 },
          mouseOnDown = { x: 0, y: 0 },
          rotation = { x: 0, y: 0 },
          target = { x: Math.PI * 3 / 2, y: Math.PI / 6.0 },
          targetOnDown = { x: 0, y: 0 };

        const curZoomSpeed = 0,
          zoomSpeed = 50,
          padding = 40,
          PI_HALF = Math.PI / 2;

        function init() {
          let shader, uniforms, material;
          w = container.offsetWidth || window.innerWidth / 2;
          h = container.offsetHeight || window.innerHeight / 1.5;

          camera = new THREE.PerspectiveCamera(30, w / h, 1, 10000);
          camera.position.z = distance;

          scene = new THREE.Scene();

          let geometry = new THREE.SphereGeometry(200, 40, 30);

          shader = Shaders['earth'];
          uniforms = THREE.UniformsUtils.clone(shader.uniforms);
          uniforms['texture'].value = imageLoad;

          material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
          });

          mesh = new THREE.Mesh(geometry, material);
          mesh.rotation.y = Math.PI;
          scene.add(mesh);

          shader = Shaders['atmosphere'];
          uniforms = THREE.UniformsUtils.clone(shader.uniforms);

          material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
          });

          mesh = new THREE.Mesh(geometry, material);
          mesh.scale.set(1.1, 1.1, 1.1);
          scene.add(mesh);

          geometry = new THREE.BoxGeometry(0.75, 0.75, 1);
          geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -0.5));

          point = new THREE.Mesh(geometry);

          renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(w, h);

          renderer.domElement.style.position = 'absolute';
          container.appendChild(renderer.domElement);
          container.addEventListener('mousedown', onMouseDown, false);
          container.addEventListener('mousewheel', onMouseWheel, false);
          document.addEventListener('keydown', onDocumentKeyDown, false);
          window.addEventListener('resize', onWindowResize, false);

          container.addEventListener('mouseover', function() {
            overRenderer = true;
          }, false);

          container.addEventListener('mouseout', function() {
            overRenderer = false;
          }, false);
        }

        function addData(data, opts) {
          let lat, lng, size, color, i, step, colorFnWrapper;

          opts.animated = opts.animated || false;
          this.is_animated = opts.animated;
          opts.format = opts.format || 'magnitude'; // other option is 'legend'
          if (opts.format === 'magnitude') {
            step = 3;
            colorFnWrapper = function(data, i) { return colorFn(data[i + 2]); }
          } else if (opts.format === 'legend') {
            step = 4;
            colorFnWrapper = function(data, i) { return colorFn(data[i + 3]); }
          } else {
            throw ('error: format not supported: ' + opts.format);
          }

          if (opts.animated) {
            if (this._baseGeometry === undefined) {
              this._baseGeometry = new THREE.Geometry();
              for (i = 0; i < data.length; i += step) {
                lat = data[i];
                lng = data[i + 1];
                color = colorFnWrapper(data, i);
                size = 0;
                addPoint(lat, lng, size, color, this._baseGeometry);
              }
            }
            if (this._morphTargetId === undefined) {
              this._morphTargetId = 0;
            } else {
              this._morphTargetId += 1;
            }
            opts.name = opts.name || 'morphTarget' + this._morphTargetId;
          }
          var subgeo = new THREE.Geometry();
          for (i = 0; i < data.length; i += step) {
            lat = data[i];
            lng = data[i + 1];
            color = colorFnWrapper(data, i);
            size = data[i + 2];
            size = size * 200;
            addPoint(lat, lng, size, color, subgeo);
          }
          if (opts.animated) {
            this._baseGeometry.morphTargets.push({ 'name': opts.name, vertices: subgeo.vertices });
          } else {
            this._baseGeometry = subgeo;
          }

        };

        function createPoints() {
          if (this._baseGeometry !== undefined) {
            if (this.is_animated === false) {
              this.points = new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({
                color: 0xffffff,
                vertexColors: THREE.FaceColors,
                morphTargets: false
              }));
            } else {
              if (this._baseGeometry.morphTargets.length < 8) {
                var padding = 8 - this._baseGeometry.morphTargets.length;
                for (var i = 0; i <= padding; i++) {
                  this._baseGeometry.morphTargets.push({ 'name': 'morphPadding' + i, vertices: this._baseGeometry.vertices });
                }
              }
              this.points = new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({
                color: 0xffffff,
                vertexColors: THREE.FaceColors,
                morphTargets: true
              }));
            }
            scene.add(this.points);
          }
        }

        function addPoint(lat, lng, size, color, subgeo) {

          var phi = (90 - lat) * Math.PI / 180;
          var theta = (180 - lng) * Math.PI / 180;

          point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
          point.position.y = 200 * Math.cos(phi);
          point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

          point.lookAt(mesh.position);

          point.scale.z = Math.max(size, 0.1); // avoid non-invertible matrix
          point.updateMatrix();

          for (var i = 0; i < point.geometry.faces.length; i++) {

            point.geometry.faces[i].color = color;

          }
          if (point.matrixAutoUpdate) {
            point.updateMatrix();
          }
          subgeo.merge(point.geometry, point.matrix);
        }

        function onMouseDown(event) {
          event.preventDefault();

          container.addEventListener('mousemove', onMouseMove, false);
          container.addEventListener('mouseup', onMouseUp, false);
          container.addEventListener('mouseout', onMouseOut, false);

          mouseOnDown.x = - event.clientX;
          mouseOnDown.y = event.clientY;

          targetOnDown.x = target.x;
          targetOnDown.y = target.y;

          container.style.cursor = 'move';
        }

        function onMouseMove(event) {
          mouse.x = - event.clientX;
          mouse.y = event.clientY;

          var zoomDamp = distance / 1000;

          target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
          target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

          target.y = target.y > PI_HALF ? PI_HALF : target.y;
          target.y = target.y < - PI_HALF ? - PI_HALF : target.y;
        }

        function onMouseUp(event) {
          container.removeEventListener('mousemove', onMouseMove, false);
          container.removeEventListener('mouseup', onMouseUp, false);
          container.removeEventListener('mouseout', onMouseOut, false);
          container.style.cursor = 'auto';
        }

        function onMouseOut(event) {
          container.removeEventListener('mousemove', onMouseMove, false);
          container.removeEventListener('mouseup', onMouseUp, false);
          container.removeEventListener('mouseout', onMouseOut, false);
        }

        function onMouseWheel(event) {
          event.preventDefault();
          if (overRenderer) {
            zoom(event.wheelDeltaY * 0.3);
          }
          return false;
        }

        function onDocumentKeyDown(event) {
          switch (event.keyCode) {
            case 38:
              zoom(100);
              event.preventDefault();
              break;
            case 40:
              zoom(-100);
              event.preventDefault();
              break;
          }
        }

        function onWindowResize(event) {
          camera.aspect = container.offsetWidth / container.offsetHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(container.offsetWidth, container.offsetHeight);
        }

        function zoom(delta) {
          distanceTarget -= delta;
          distanceTarget = distanceTarget > 1000 ? 1000 : distanceTarget;
          distanceTarget = distanceTarget < 350 ? 350 : distanceTarget;
        }

        function animate() {
          requestAnimationFrame(animate);
          render();
        }

        function render() {
          zoom(curZoomSpeed);

          rotation.x += (target.x - rotation.x) * 0.1;
          rotation.y += (target.y - rotation.y) * 0.1;
          distance += (distanceTarget - distance) * 0.3;

          camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
          camera.position.y = distance * Math.sin(rotation.y);
          camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

          camera.lookAt(mesh.position);

          renderer.render(scene, camera);
        }

        init();
        this.animate = animate;


        this.__defineGetter__('time', function() {
          return this._time || 0;
        });

        this.__defineSetter__('time', function(t) {
          var validMorphs = [];
          var morphDict = this.points.morphTargetDictionary;
          for (var k in morphDict) {
            if (k.indexOf('morphPadding') < 0) {
              validMorphs.push(morphDict[k]);
            }
          }
          validMorphs.sort();
          var l = validMorphs.length - 1;
          var scaledt = t * l + 1;
          var index = Math.floor(scaledt);
          for (i = 0; i < validMorphs.length; i++) {
            this.points.morphTargetInfluences[validMorphs[i]] = 0;
          }
          var lastIndex = index - 1;
          var leftover = scaledt - index;
          if (lastIndex >= 0) {
            this.points.morphTargetInfluences[lastIndex] = 1 - leftover;
          }
          this.points.morphTargetInfluences[index] = leftover;
          this._time = t;
        });

        this.addData = addData;
        this.createPoints = createPoints;
        this.renderer = renderer;
        this.scene = scene;

        return this;

      };

      // this particular implementation

      // to be updated to held data
      var years = ['1990', '1995', '2000'];
      var container = document.getElementById('container');
      var globe = new DAT.Globe(container);

      var i, tweens = [];

      var settime = function(globe, t) {
        return function() {
          globe.time = t / years.length
          //new TWEEN.Tween(globe).to({ time: t / years.length }, 500).easing(TWEEN.Easing.Cubic.EaseOut).start();
          var y = document.getElementById('year' + years[t]);
          if (y.getAttribute('class') === 'year active') {
            return;
          }
          var yy = document.getElementsByClassName('year');
          for (i = 0; i < yy.length; i++) {
            yy[i].setAttribute('class', 'year');
          }
          y.setAttribute('class', 'year active');
        };
      };

      for (var i = 0; i < years.length; i++) {
        var y = document.getElementById('year' + years[i]);
        y.addEventListener('mouseover', settime(globe, i), false);
      }

      var xhr;
      //TWEEN.start();

      // xhr = new XMLHttpRequest();
      // xhr.open('GET', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/speaking.json', true);
      // xhr.onreadystatechange = function(e) {
      //   if (xhr.readyState === 4) {
      //     if (xhr.status === 200) {
      //       var data = JSON.parse(xhr.responseText);
      //       window.data = data;
      //       for (i = 0; i < data.length; i++) {
      //         globe.addData(data[i][1], { format: 'magnitude', name: data[i][0], animated: true });
      //       }
      //       globe.createPoints();
      //       settime(globe, 0)();
      //       globe.animate();
      //       document.body.style.backgroundImage = 'none'; // remove loading
      //     }
      //   }
      // };
      // xhr.send(null);

      xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/population909500.json', true);
      xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            window.data = data;
            for (i = 0; i < data.length; i++) {
              globe.addData(data[i][1], { format: 'magnitude', name: data[i][0], animated: true });
            }
            globe.createPoints();
            settime(globe, 0)();
            globe.animate();
            document.body.style.backgroundImage = 'none'; // remove loading
          }
        }
      };
      xhr.send(null);


      // let data = this.mapData;
      // window.data = data;
      // for (i = 0; i < data.length; i++) {
      //   globe.addData(data[i][1], { format: 'magnitude', name: data[i][0], animated: true });
      // }
      // globe.createPoints();
      // settime(globe, 0)();
      // globe.animate();
      // document.body.style.backgroundImage = 'none'; // remove loading

    },
    tryGeo(dataI) {
      let request = new XMLHttpRequest(),
        vueThis = this,
        city = dataI.Location,
        year = dataI.From.substr(dataI.From.length - 4),
        location;

      request.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(city), true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          const data = JSON.parse(request.responseText);
          location = data.results[0].geometry.location;

          if (year == '2017') {
            vueThis.t2017.push(location.lat, location.lng, 30);
          } else {
            vueThis.t2018.push(location.lat, location.lng, 30);
          }

        } else {
          console.log('bummah. we reached the target server but it errored')
        }
      };
      request.onerror = function() {
        console.log('connection error! nooo')
      };
      request.send();
    },
    createIndex() {
      this.speakerData.forEach((i) => {
        this.tryGeo(i)
      })
    },
  },
  computed: {
    speakerData() {
      return this.$store.state.speakerData;
    }
  },
  mounted() {
    // this.createIndex().then(
    //   this.mapData.push('2017', [this.t2017], '2018', [this.t2018])
    // )

    // let myFirstPromise = new Promise((resolve, reject) => {
    //   this.createIndex()
    // }).then(
    //   this.mapData.push('2017', this.t2017, '2018', this.t2018)
    //   ).then(
    //   console.log('yoyoyo')
    //   )
    let earthmap = THREE.TextureLoader('/world.jpg');
    this.initGlobe(earthmap);
  }
}
</script>

<style scoped>
html {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  color: #ffffff;
  font-family: sans-serif;
  font-size: 13px;
  line-height: 20px;
  height: 100%;
}

#container {
  width: 60%;
  height: 70%;
  position: fixed;
  right: -100px;
  top: 20%;
}

#info {
  font-size: 11px;
  position: absolute;
  bottom: 5px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 3px;
  right: 10px;
  padding: 10px;
}

#currentInfo {
  width: 270px;
  position: absolute;
  left: 500px;
  top: 50px;
  background-color: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  padding: 10px;
}

a {
  color: #aaa;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.bull {
  padding: 0 5px;
  color: #555;
}

#title {
  position: absolute;
  top: 20px;
  width: 270px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  font-size: 20px;
  padding: 10px;
}

.year {
  font-size: 16px;
  line-height: 26px;
  height: 30px;
  text-align: center;
  float: left;
  width: 90px;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  -webkit-transition: all 0.1s ease-out;
}

.year:hover,
.year.active {
  font-size: 23px;
  color: #fff;
}
</style>