import type { FC } from "react";

import { Text } from "@/components/Text";
import { TextColor, TextVariant } from "@/types";

import type { SliderMark } from "./Slider";

/**
 * Component which renders the labels of a slider's marks under its track,
 * each at its value; a label slides from left- to right-aligned along the
 * track so the end ones never overflow it.
 *
 * @param marks The slider's marks; only those with a `label` render.
 * @param max Maximum value of the slider.
 * @param min Minimum value of the slider.
 *
 * @internal For use by {@link BaseSlider}.
 */
export const SliderMarks: FC<{
  marks: SliderMark[];
  max: number;
  min: number;
}> = ({ marks, max, min }) => {
  const labeled = marks.filter((mark) => mark.label !== undefined);
  if (!labeled.length) return null;
  return (
    <div className="relative -mt-2 w-full" aria-hidden>
      <Text variant={TextVariant.Caption} className="invisible">
        {labeled[0].label}
      </Text>
      {labeled.map(({ value, label }) => {
        const at = (value - min) / (max - min);
        return (
          <Text
            key={value}
            variant={TextVariant.Caption}
            color={TextColor.Secondary}
            className="absolute top-0 whitespace-nowrap"
            style={{
              left: `${at * 100}%`,
              transform: `translateX(${-at * 100}%)`,
            }}
          >
            {label}
          </Text>
        );
      })}
    </div>
  );
};

SliderMarks.displayName = "SliderMarks";
