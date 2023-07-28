import useConfig from '../../hooks/useConfig';
import useSelectedText from '../../hooks/useSelectedText';

export default function HighlightController() {
  const config = useConfig();
  const selection = useSelectedText();

  if (!config.enabled) return null;

  return (
    <></>
  );
}
