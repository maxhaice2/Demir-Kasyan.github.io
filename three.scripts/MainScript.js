import * as THREE from 'three.addons/three.module.js';
import { GLTFLoader } from '/three.addons/three.gltfLoader.js';

import { MainControl } from './MainControl.js';


var camera, scene, renderer, control, loader;

			var raycaster;
			var vertex = new THREE.Vector3();
			var color = new THREE.Color();
            
            init();
            animate();

			function init() {

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.y = 10;
				camera.lookAt( 1.0, 10.0, 0.0 );

				scene = new THREE.Scene();

				control = new MainControl( camera );

                loader = new GLTFLoader();

				scene.add( camera );
                
                loader.load( './Card.gltf', function ( data ) {
					 var object = data.scene;
					 
						object.position.set(1.0, 10.0, 0.0);
						
                        scene.add( object );
                });


				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );
				
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