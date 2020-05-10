import React, { Suspense,useRef, useState,useEffect ,useMemo} from 'react'
import {View } from 'react-native'
import { Canvas, useFrame ,useLoader,useUpdate} from 'react-three-fiber'
import Effects from './Effect.js';
import { LinearGradient } from 'expo-linear-gradient';
import EightBit from './8BIT_WONDER.json';

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))
  
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={e => setActive(!active)}
      >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={active ? '#0652C5' : '#0FD64F'} />
    </mesh>
  )
}


function Text({ children, vAlign = 'center', hAlign = 'center', size = 2, color = '#000000', ...props }) {
  
  const loader = new THREE.FontLoader()
  const font = loader.parse(EightBit)
  

  const config = useMemo(
    () => ({
      font,
      size: 2,
      height: 0,
      curveSegments: 32,
      bevelEnabled: false,
      bevelThickness: 6,
      bevelSize: 2.5,
      bevelOffset: 0,
      bevelSegments: 8,
    }),
    [font]
  )
  console.log("update text 3");
  const mesh = useUpdate(
    self => {
      const size = new THREE.Vector3()
      self.geometry.computeBoundingBox()
      self.geometry.boundingBox.getSize(size)
      self.position.x = hAlign === 'center' ? -size.x / 2 : hAlign === 'right' ? 0 : -size.x
      self.position.y = vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y
      
    },
    [children]
  )
  
  return (
    <group {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
      <mesh ref={mesh}>
        <textGeometry attach="geometry" args={[children, config]} />
        <meshNormalMaterial attach="material"  />
      </mesh>
    </group>
  )
}



function Jumbo() {

 const ref = useRef()
 useFrame(
    ({ clock }) =>{
      (ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z =
        Math.sin(clock.getElapsedTime()) * 0.3)
      
    }
  )
  return (
    <group ref={ref}>
      <Text hAlign="center" position={[0, 2, 0]} children="Hello World" />
       <Text hAlign="center" position={[0, 1, 0]} children="Fancy flying text" />
    </group>
    )

  
}
   

export default function App() {
 
 
return(
  <LinearGradient
        colors={['#FE5F75', '#FC9842']}
        style={{flex: 1}}
      >
  <Canvas onCreated={({ gl }) => {

        gl.toneMapping = THREE.Uncharted2ToneMapping
        gl.setClearAlpha(0)
      }} alpha={true}>
      
    <ambientLight />
    <pointLight distance={100} intensity={4} color="white" />
    <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, 0, 0]} />
    <Effects down={1} />
    <Suspense fallback={null}>
        <Jumbo />
    </Suspense>
  </Canvas> 
 </LinearGradient>

)
}