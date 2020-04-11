import * as THREE from './three.module.js';
import { MainControl } from './MainControl.js';
import { GLTFLoader } from './GLTFLoader.js';

var camera, scene, renderer, control, loader;

			var raycaster;
			var vertex = new THREE.Vector3();
			var color = new THREE.Color();
            
            init();
            animate();
            // if(window.DeviceMotionEvent){
			// 	console.log(camera.position);
  			//     window.addEventListener("devicemotion", motion, false);
			// }else{
  			// 	console.log("DeviceMotionEvent is not supported");
            // }

			function init() {

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.y = 10;

				scene = new THREE.Scene();

				control = new MainControl( camera );

                loader = new GLTFLoader();

				scene.add( camera );


				raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

				// floor

				var floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
				floorGeometry.rotateX( - Math.PI / 2 );

				// vertex displacement

				var position = floorGeometry.attributes.position;

				for ( var i = 0, l = position.count; i < l; i ++ ) {

					vertex.fromBufferAttribute( position, i );

					vertex.x += Math.random() * 20 - 10;
					vertex.y += Math.random() * 2;
					vertex.z += Math.random() * 20 - 10;

					position.setXYZ( i, vertex.x, vertex.y, vertex.z );

				}

				floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

				position = floorGeometry.attributes.position;
				var colors = [];

				for ( var i = 0, l = position.count; i < l; i ++ ) {

					color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
					colors.push( color.r, color.g, color.b );

				}

				floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

				var floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } );

				var floor = new THREE.Mesh( floorGeometry, floorMaterial );
				scene.add( floor );
                
                loader.crossOrigin = true;
                loader.load( './Card.gltf', function ( data ) {
                     var object = data.scene;
                        object.position.set(0.0, 10.0, -1.0);
                        scene.add( object );
                });


				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				//
                
				window.addEventListener( 'resize', onWindowResize, false );
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

            }
            function animate() {

				requestAnimationFrame( animate );

				control.update();
				renderer.render( scene, camera );

			}