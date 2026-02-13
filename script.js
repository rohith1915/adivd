/* DOM */
const passInput=document.getElementById("passInput");
const passwordScreen=document.getElementById("passwordScreen");
const spaceCanvas=document.getElementById("spaceCanvas");
const cinematicIntro=document.getElementById("cinematicIntro");
const main=document.getElementById("main");
const message=document.getElementById("message");
const yesBtn=document.getElementById("yesBtn");
const noBtn=document.getElementById("noBtn");
const timer=document.getElementById("timer");
const bgMusic=document.getElementById("bgMusic");
const petalCanvas=document.getElementById("petalCanvas");
const heart3DContainer=document.getElementById("heart3DContainer");

/* PASSWORD */
function checkPassword(){
 if(passInput.value==="1724"){
  passwordScreen.style.display="none";
  startIntro();
 }else alert("Wrong password ❤️");
}

/* THREE INTRO */
let renderer,scene,camera,stars;

function startIntro(){
 renderer=new THREE.WebGLRenderer({canvas:spaceCanvas});
 renderer.setSize(innerWidth,innerHeight);

 scene=new THREE.Scene();
 camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000);
 camera.position.z=5;

 const starGeo=new THREE.BufferGeometry();
 const starCount=2000;
 const pos=new Float32Array(starCount*3);

 for(let i=0;i<starCount;i++){
  pos[i*3]=(Math.random()-0.5)*50;
  pos[i*3+1]=(Math.random()-0.5)*50;
  pos[i*3+2]=(Math.random()-0.5)*50;
 }

 starGeo.setAttribute("position",new THREE.BufferAttribute(pos,3));

 stars=new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({size:0.05,sizeAttenuation:true})
 );

 scene.add(stars);
 animateIntro();

 setTimeout(()=>{
  cinematicIntro.style.opacity="0";
  setTimeout(()=>{
   cinematicIntro.style.display="none";
   main.style.display="block";
  },1000);
 },11000);
}

function animateIntro(){
 requestAnimationFrame(animateIntro);

 if(camera.position.z>1){
  camera.position.z-=0.01;
 }

 stars.rotation.z+=0.002;
 renderer.render(scene,camera);
}

/* RESIZE */
window.addEventListener("resize",()=>{
 if(renderer){
  renderer.setSize(innerWidth,innerHeight);
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
 }
 petalCanvas.width=innerWidth;
 petalCanvas.height=innerHeight;
});

/* FIREWORK */
function explosion(x,y){
 if(document.querySelectorAll(".firework").length>200) return;

 for(let i=0;i<60;i++){
  const e=document.createElement("div");
  e.className="firework";
  e.innerHTML="💖";

  const angle=Math.random()*Math.PI*2;
  const dist=150+Math.random()*200;

  e.style.left=x+"px";
  e.style.top=y+"px";
  e.style.setProperty("--x",Math.cos(angle)*dist+"px");
  e.style.setProperty("--y",Math.sin(angle)*dist+"px");

  document.body.appendChild(e);
  setTimeout(()=>e.remove(),1500);
 }
}

/* BUTTONS */
yesBtn.onclick=(e)=>{
 const r=yesBtn.getBoundingClientRect();
 explosion(r.left,r.top);

 bgMusic.currentTime=0;
 bgMusic.play().catch(()=>{});

 main.style.display="none";
 message.style.display="block";
 loadHeartModel();
};

noBtn.onmouseover=()=>{
 noBtn.style.left=Math.random()*(innerWidth-100)+"px";
 noBtn.style.top=Math.random()*(innerHeight-50)+"px";
};



/* PETALS */
const ctx=petalCanvas.getContext("2d");
petalCanvas.width=innerWidth;
petalCanvas.height=innerHeight;

let petals=[];
for(let i=0;i<30;i++){
 petals.push({
  x:Math.random()*innerWidth,
  y:Math.random()*innerHeight,
  size:3+Math.random()*3,
  speed:0.5+Math.random()*1.5
 });
}

function drawPetals(){
 ctx.clearRect(0,0,innerWidth,innerHeight);
 ctx.fillStyle="rgba(255,182,193,0.8)";

 petals.forEach(p=>{
  ctx.beginPath();
  ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
  ctx.fill();
  p.y+=p.speed;
  if(p.y>innerHeight) p.y=0;
 });

 requestAnimationFrame(drawPetals);
}
drawPetals();

/* HEART MODEL */
function loadHeartModel(){

 const r=new THREE.WebGLRenderer({alpha:true});
 r.setSize(180,180);
 heart3DContainer.appendChild(r.domElement);

 const s=new THREE.Scene();
 const c=new THREE.PerspectiveCamera(45,1,0.1,100);
 c.position.z=3;

 const light=new THREE.PointLight(0xffffff,1);
 light.position.set(5,5,5);
 s.add(light);

 const loader=new THREE.GLTFLoader();
 loader.load(
  "heart.glb",
  (gltf)=>{
   const heart=gltf.scene;
   s.add(heart);

   function animate(){
    requestAnimationFrame(animate);
    heart.rotation.y+=0.01;
    r.render(s,c);
   }
   animate();
  },
  undefined,
  (err)=>console.log("Heart load error",err)
 );
}
