import { useThree } from '@react-three/fiber';
import { CubeTextureLoader } from 'three';
import { useEffect } from 'react';

export const Skybox = () => {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new CubeTextureLoader();
    // The order is: pos-x, neg-x, pos-y, neg-y, pos-z, neg-z
    const texture = loader.load([
      'Texturelabs_Sky_143S.jpg',
      'Texturelabs_Sky_143S.jpg',
      'Texturelabs_Sky_143S.jpg',
      'Texturelabs_Sky_143S.jpg',
      'Texturelabs_Sky_143S.jpg',
      'Texturelabs_Sky_143S.jpg',
    ]);
    scene.background = texture;
  }, [scene]);

  return null;
};