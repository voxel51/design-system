import { render, screen, within } from "@testing-library/react";
import { RichButtonGroup } from "@/components/RichButtonGroup/RichButtonGroup.tsx";
import { RichButtonProps } from "@/components/RichButton";
import { Descriptor } from "@/types";
import userEvent, { UserEvent } from "@testing-library/user-event";

describe("RichButtonGroup", () => {
  let testId: string;
  let defaultProps: { "data-testid": string };

  beforeEach(() => {
    testId = Math.random().toString(36).substring(2, 9);
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
        const id = Math.random().toString(36).substring(2, 9);
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
