import { set, useFormValue, type StringInputProps } from "sanity";
import { DEFAULT_PRESET, THEME_PRESETS, isHex, type ThemeKey } from "../../lib/theme";

// A swatch that opens the browser's colour picker, next to the normal text box
// for typing a hex code. When the box is empty the swatch shows the preset
// colour the site is currently using.
export function ColorInput(props: StringInputProps) {
  const { value, onChange, readOnly, schemaType } = props;
  const preset = useFormValue(["themePreset"]) as string | undefined;
  const key = (schemaType.options as { themeKey?: ThemeKey } | undefined)?.themeKey;
  const presetColor = key
    ? (THEME_PRESETS[preset ?? ""] ?? THEME_PRESETS[DEFAULT_PRESET]).colors[key]
    : "#000000";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <input
        type="color"
        value={isHex(value) ? value.toLowerCase() : presetColor}
        disabled={readOnly}
        onChange={(event) => onChange(set(event.currentTarget.value))}
        aria-label={`Choose ${schemaType.title ?? "colour"}`}
        style={{
          width: 52,
          height: 36,
          flexShrink: 0,
          padding: 2,
          border: "1px solid rgba(128, 128, 128, 0.4)",
          borderRadius: 4,
          background: "transparent",
          cursor: readOnly ? "default" : "pointer",
        }}
      />
      <div style={{ flex: 1 }}>{props.renderDefault(props)}</div>
    </div>
  );
}
