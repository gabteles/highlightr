import Sidebar from '../Sidebar';
import Highlighter from '../Highlighter';
import HighlightMarkers from '../HighlightMarkers';
import { useContext } from 'react';
import ConfigContext from '../../context/ConfigContext';


export default function HighlightrElements() {
  const config = useContext(ConfigContext);

  if (!config.enabled) return null;

  return (
    <>
      <HighlightMarkers />
      <Highlighter />
      <Sidebar />
    </>
  );
}
