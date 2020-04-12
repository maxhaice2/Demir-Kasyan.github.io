import * as THREE from '../three.addons/three.module.js';
import { GLTFLoader } from '../three.addons/three.gltfLoader.js';

import { MainControl } from './MainControl.js';


var camera, scene, renderer, raycaster, control, loader, mesh;


			
			var vertex = new THREE.Vector3();
			var color = new THREE.Color();
            
            init();
            animate();
	
				function init() {
	
					camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
					camera.position.y = 10;
	
					scene = new THREE.Scene();
	
					var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
					light.position.set( 0.5, 1, 0.75 );
					scene.add( light );
	
					control = new MainControl( camera );
	
					raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
	
	
					var floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
					floorGeometry.rotateX( - Math.PI / 2 );
	
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