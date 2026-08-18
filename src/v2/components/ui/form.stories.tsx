import type { Meta, StoryObj } from "@storybook/react-vite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@voxel51/voodo/v2";
import { FormField } from "@voxel51/voodo/v2/form";

/**
 * react-hook-form binding. `FormField` wires a control to the form state and
 * `FormMessage` renders its validation error; both read from context, so
 * `id`, `aria-describedby` and `aria-invalid` are set automatically.
 *
 * Note the import: the flat barrel's `FormField` is the layout row from
 * `form-section`. This controller-bound one is at
 * `@voxel51/voodo/v2/form`, or as `FormSectionField` for the other.
 *
 * Validation is the caller's — pair with zod, yup or a hand-written resolver.
 */
const meta: Meta<typeof Form> = {
  title: "v2/Components/Form",
  component: Form,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Form>;

const schema = z.object({
  name: z
    .string()
    .min(3, "At least 3 characters.")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, digits and hyphens only."),
  endpoint: z.string().url("Must be a valid URL."),
});

export const WithValidation: Story = {
  render: function WithValidationStory() {
    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: { name: "", endpoint: "" },
      mode: "onBlur",
    });

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {})}
          className="flex w-96 flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service name</FormLabel>
                <FormControl>
                  <Input placeholder="argo-prod" {...field} />
                </FormControl>
                <FormDescription>Doubles as the service id.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endpoint</FormLabel>
                <FormControl>
                  <Input placeholder="https://argo.internal:2746" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create service</Button>
        </form>
      </Form>
    );
  },
};
