let fixation = false,
    alignment = false,
    reSpace = true, 
    soundIntro = new Audio('https://cdn.jsdelivr.net/gh/Demir-Kasyan/Demir-Kasyan.github.io/resourses/trash/mp3.tarot.sounds/intro2.mp3'),
    soundName = new Audio('https://cdn.jsdelivr.net/gh/Demir-Kasyan/Demir-Kasyan.github.io/resourses/trash/mp3.tarot.sounds/hi-blair.mp3'),
    soundCard = soundName;
    
    AFRAME.registerComponent('ar-hit-test', {
			init: function () {
				this.xrHitTestSource = null;
				this.viewerSpace = null;
				this.refSpace = null;

				this.el.sceneEl.renderer.xr.addEventListener('sessionend', (ev) => {
					this.viewerSpace = null;
					this.refSpace = null;
					this.xrHitTestSource = null;
				});
				this.el.sceneEl.renderer.xr.addEventListener('sessionstart', (ev) => {
					let session = this.el.sceneEl.renderer.xr.getSession();

					let element = this.el;
					session.addEventListener('select', function () {
					  if(!fixation) {
                        element.setAttribute('visible','false');

						let position = element.getAttribute('position');
                        
                        setTimeout(() => reSpace = true, 8000);
                        
						document.getElementById('cards').setAttribute('position', {
                            x: (position.x),
							y: (position.y - 1.255),
							z: (position.z)
                        });
						reSpace = false;
					  }
					});

					session.requestReferenceSpace('viewer').then((space) => {
						this.viewerSpace = space;
						session.requestHitTestSource({space: this.viewerSpace})
								.then((hitTestSource) => {
									this.xrHitTestSource = hitTestSource;
								});
					});

					session.requestReferenceSpace('local-floor').then((space) => {
						this.refSpace = space;
					});
				});
			},
			tick: function () {
				if (this.el.sceneEl.is('ar-mode')) {
					if (!this.viewerSpace) return;

					let frame = this.el.sceneEl.frame;
					let xrViewerPose = frame.getViewerPose(this.refSpace);

					if (this.xrHitTestSource && xrViewerPose) {
						let hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
						if (hitTestResults.length > 0) {
                          
                          if(!fixation && reSpace) {

                            this.el.setAttribute('visible','true');

							let pose = hitTestResults[0].getPose(this.refSpace);

							let inputMat = new THREE.Matrix4();
							inputMat.fromArray(pose.transform.matrix);

							let position = new THREE.Vector3();
							position.setFromMatrixPosition(inputMat);
                            this.el.setAttribute('position', position);
                            
							}
						}
					}
				}
			}
        });

    AFRAME.registerComponent('fix', {
            init: function () {
                this.el.addEventListener('click', function (evt) {
                    this.setAttribute("visible",
                                      "false");
                      soundName.play();
                      soundName.addEventListener("ended",function(){soundIntro.play();})
                      fixation = true;
              
                                                                 }
                                        );
        }});

    AFRAME.registerComponent('click-card', {
            init: function () {
                this.el.addEventListener('click', function (evt) {
                  if(alignment && soundCard.paused) {
                    this.setAttribute("animation",
                    "property: rotation; to: -90 0 0; dur: 800; loop: false");
                    let path = setSound(this.id);              
                    soundCard = new Audio("https://cdn.jsdelivr.net/gh/Demir-Kasyan/Demir-Kasyan.github.io/resourses/trash/mp3.tarot.sounds/love/"+path);
                    soundCard.play();
                        soundCard.addEventListener('ended',function (){
                          let sound1 = new Audio("https://cdn.jsdelivr.net/gh/Demir-Kasyan/Demir-Kasyan.github.io/resourses/trash/mp3.tarot.sounds/name/"+path);
                            sound1.play();
                        });
                                                                 }
                                                                 } );
                                                                
        }});

	AFRAME.registerComponent('aligmenting-4-on-8', {
          init: function () {
              this.el.addEventListener('click', function (evt) {
				 if( fixation && !alignment && (soundName.paused && soundIntro.paused) ){

                    setAligmenting(document.getElementById('first'),1);

                    setTimeout(() => setAligmenting(document.getElementById('second'), 2 ) , 1001 );

                    setTimeout(() => setAligmenting(document.getElementById('third'), 3 ) , 2002 );

                    setTimeout(() => setAligmenting(document.getElementById('fourth'), 4 ) , 3003 );
                    alignment = true;
                 }});
        }});
                              
    
    function setAligmenting(elem, posit){
            let poseX = ( posit > 4 ? "-" : "") + ( 1.0 - posit * 0.20);
            let poseZ = ( posit < 5 ) ? ( -0.20 + posit * 0.20 ) : ( 0.80 - posit * 0.20);
            let poseY = elem.getAttribute('position').y- (8 - posit) * 0.08;
            elem.setAttribute("animation",
                                "property: position; to: " + poseZ + " " + poseY + " " + poseX + "; dur: 1000; easing: linear; loop: false");
        }

    function setSound(posit){
        switch (posit){
            case 'first':
                return "1.mp3";
            case 'second':
                return "2.mp3";
            case 'third':
                return "3.mp3";
            case 'fourth':
                return "4.mp3";
            default:
                return "2.mp3";
        }
        }
  