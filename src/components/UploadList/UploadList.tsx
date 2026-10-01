import clsx from "clsx";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { IconAction } from "@/components/IconAction";
import { TextAction } from "@/components/TextAction";
import radiusStyles from "@/styles/radius";
import { TEXT_STYLES } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  IconName,
  Radius,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { formatBytes } from "@/util/formatBytes";

/** One file in an {@link UploadList}. */
export interface UploadListItem {
  id: string;
  name: string;
  kind?: ReactNode;
  size: number;
}

export interface UploadListProps extends HTMLAttributes<HTMLDivElement> {
  items: UploadListItem[];
  summary?: ReactNode;
  onRemove?: (id: string) => void;
  onRemoveAll?: () => void;
}

/**
 * Lists files chosen for upload under a count-and-size summary. Each row shows
 * the file's name, kind and size, with a remove action on hover or focus.
 *
 * @example
 * ```tsx
 * <UploadList
 *   items={[{ id: "a", name: "cat.jpg", kind: "JPG", size: 20480 }]}
 *   onRemove={removeFile}
 *   onRemoveAll={clearFiles}
 * />
 * ```
 *
 * @param items The files to list. Sizes are in bytes.
 * @param summary Replaces the default "N files · size" summary.
 * @param onRemove Called with an item's `id` when its remove action is clicked. Omit it to hide the per-row action.
 * @param onRemoveAll Called when "Remove all" is clicked. Omit it to hide the action.
 * @param className Additional CSS class names to apply to the container.
 * @param props Additional HTML properties to apply to the container.
 */
export const UploadList: FC<UploadListProps> = ({
  items,
  summary,
  onRemove,
  onRemoveAll,
  className,
  ...props
}) => {
  const bytes = items.reduce((total, item) => total + item.size, 0);
  const secondary = textColorClass(TextColor.Secondary);
  return (
    <div className={className} {...props}>
      <div className="flex items-center justify-between">
        <span
          className={clsx(TEXT_STYLES[TextVariant.BodySecondary], secondary)}
        >
          {summary ??
            `${items.length} file${items.length === 1 ? "" : "s"} · ${formatBytes(bytes)}`}
        </span>
        {onRemoveAll && (
          <TextAction size={Size.Sm} onClick={onRemoveAll}>
            Remove all
          </TextAction>
        )}
      </div>
      <ul
        className={clsx(
          "mt-[10px] max-h-[256px] divide-y divide-content-border-subtle overflow-y-auto px-[12px]",
          radiusStyles(Radius.Lg),
          bgColorClass(BackgroundColor.Card)
        )}
      >
        {items.map((item) => (
          <li
            key={item.id}
            className={clsx(
              "group flex items-center gap-[12px] py-[10px]",
              TEXT_STYLES[TextVariant.BodySecondary]
            )}
          >
            <span
              className={clsx(
                "min-w-0 flex-1 truncate",
                textColorClass(TextColor.Primary)
              )}
              title={item.name}
            >
              {item.name}
            </span>
            {item.kind && (
              <span className={clsx("shrink-0", secondary)}>{item.kind}</span>
            )}
            <span
              className={clsx(
                "w-[64px] shrink-0 text-right tabular-nums",
                secondary
              )}
            >
              {formatBytes(item.size)}
            </span>
            {onRemove && (
              <IconAction
                size={Size.Sm}
                icon={IconName.Close}
                aria-label={`Remove ${item.name}`}
                className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                onClick={() => onRemove(item.id)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

UploadList.displayName = "UploadList";
