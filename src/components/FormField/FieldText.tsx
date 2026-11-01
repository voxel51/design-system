import { Description } from "@headlessui/react";
import type { FC, ReactNode } from "react";

import { TEXT_STYLES } from "@/styles/text";
import { TextColor, textColorClass, TextVariant } from "@/types";
import { cn } from "@/util/classes";

/**
 * Label and optional helper line beside a choice control (Checkbox, Toggle,
 * Radio); must render inside a headless `Field`.
 *
 * @internal
 * @param label The control's label node.
 * @param description Helper text under the label.
 * @example
 * <FieldText label={<Label>Label</Label>} description="Helper" />
 */
export const FieldText: FC<{ label?: ReactNode; description?: ReactNode }> = ({
  label,
  description,
}) =>
  description ? (
    <div className="flex min-w-0 flex-col gap-1">
      {label}
      <Description
        className={cn(
          textColorClass(TextColor.Tertiary),
          TEXT_STYLES[TextVariant.BodyTertiary]
        )}
      >
        {description}
      </Description>
    </div>
  ) : (
    <>{label}</>
  );
