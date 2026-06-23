import { render, screen, within } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";

import { RichButtonProps } from "@/components/RichButton";
import { RichButtonGroup } from "@/components/RichButtonGroup/RichButtonGroup.tsx";
import { Descriptor } from "@/types";
import { randomString } from "@/util/random";

describe("RichButtonGroup", () => {
  let testId: string;
  let defaultProps: { "data-testid": string };

  beforeEach(() => {
    testId = randomString();
    defaultProps = { "data-testid": testId };
  });

  it("should render", () => {
    render(<RichButtonGroup {...defaultProps} buttons={[]} />);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  describe("with buttons", () => {
    let buttons: Descriptor<RichButtonProps>[];
    let user: UserEvent;

    beforeEach(() => {
      buttons = new Array(3).fill(0).map(() => {
        const id = randomString();
        return {
          id,
          data: {
            onClick: jest.fn(),
            "data-testid": id,
          },
        };
      });

      user = userEvent.setup();
    });

    it("should render all buttons", () => {
      render(<RichButtonGroup {...defaultProps} buttons={buttons} />);

      const group = screen.getByTestId(testId);
      buttons.forEach((buttonProps) =>
        expect(within(group).getByTestId(buttonProps.id)).toBeInTheDocument()
      );
    });

    it("should call button onClick", async () => {
      render(<RichButtonGroup {...defaultProps} buttons={buttons} />);

      const group = screen.getByTestId(testId);

      for (const buttonProps of buttons) {
        await user.click(within(group).getByTestId(buttonProps.id));
        expect(buttonProps.data.onClick).toHaveBeenCalledTimes(1);
      }
    });

    describe("when controlled", () => {
      it("should render specified buttons as active", () => {
        const activeIdxs = [0, 1];
        const active = activeIdxs.map((idx) => buttons[idx].id);

        render(
          <RichButtonGroup
            {...defaultProps}
            buttons={buttons}
            activeIds={active}
          />
        );

        const group = screen.getByTestId(testId);

        // validate active buttons
        activeIdxs.forEach((idx) => {
          expect(within(group).getByTestId(buttons[idx].id)).toHaveClass(
            "data-active"
          );
        });

        // validate inactive buttons
        new Array(buttons.length)
          .fill(0)
          .map((_, i) => i)
          .filter((idx) => !activeIdxs.includes(idx))
          .forEach((idx) => {
            expect(within(group).getByTestId(buttons[idx].id)).not.toHaveClass(
              "data-active"
            );
          });
      });
    });

    describe("selection", () => {
      let onChange: (active: string[]) => void;

      beforeEach(() => {
        onChange = jest.fn();
      });

      describe("with mutual exclusivity", () => {
        it("should emit active button", async () => {
          render(
            <RichButtonGroup
              {...defaultProps}
              exclusive={true}
              buttons={buttons}
              onChange={onChange}
            />
          );

          const group = screen.getByTestId(testId);

          for (const buttonProps of buttons) {
            await user.click(within(group).getByTestId(buttonProps.id));
            expect(onChange).toHaveBeenCalledWith([buttonProps.id]);
          }
        });

        it("should allow for deselection", async () => {
          render(
            <RichButtonGroup
              {...defaultProps}
              exclusive={true}
              buttons={buttons}
              onChange={onChange}
            />
          );

          const group = screen.getByTestId(testId);
          const buttonProps = buttons[0];
          const button = within(group).getByTestId(buttonProps.id);

          // activate
          await user.click(button);

          expect(onChange).toHaveBeenCalledWith([buttonProps.id]);

          // deactivate
          await user.click(button);

          expect(onChange).toHaveBeenCalledWith([]);
        });
      });

      describe("without mutual exclusivity", () => {
        it("should emit active buttons", async () => {
          render(
            <RichButtonGroup
              {...defaultProps}
              exclusive={false}
              buttons={buttons}
              onChange={onChange}
            />
          );

          const group = screen.getByTestId(testId);

          for (let i = 0; i < buttons.length; ++i) {
            await user.click(within(group).getByTestId(buttons[i].id));

            const expectedActiveIds = buttons
              .slice(0, i + 1)
              .map((props) => props.id);
            expect(onChange).toHaveBeenCalledWith(expectedActiveIds);
          }
        });

        it("should allow for deselection", async () => {
          render(
            <RichButtonGroup
              {...defaultProps}
              exclusive={false}
              buttons={buttons}
              onChange={onChange}
            />
          );

          const group = screen.getByTestId(testId);
          const buttonProps = buttons[0];
          const button = within(group).getByTestId(buttonProps.id);

          // activate
          await user.click(button);

          expect(onChange).toHaveBeenCalledWith([buttonProps.id]);

          // deactivate
          await user.click(button);

          expect(onChange).toHaveBeenCalledWith([]);
        });
      });
    });
  });
});
