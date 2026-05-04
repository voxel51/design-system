import { act, renderHook } from "@testing-library/react";

import { useDisclosure } from "./useDisclosure";

describe("useDisclosure", () => {
  describe("initial state", () => {
    it("defaults to open", () => {
      const { result } = renderHook(() => useDisclosure());
      expect(result.current.open).toBe(true);
    });

    it("respects defaultOpen=false", () => {
      const { result } = renderHook(() => useDisclosure({ defaultOpen: false }));
      expect(result.current.open).toBe(false);
    });

    it("respects defaultOpen=true", () => {
      const { result } = renderHook(() => useDisclosure({ defaultOpen: true }));
      expect(result.current.open).toBe(true);
    });
  });

  describe("uncontrolled", () => {
    it("toggle closes when open", () => {
      const { result } = renderHook(() => useDisclosure({ defaultOpen: true }));
      act(() => { result.current.toggle(); });
      expect(result.current.open).toBe(false);
    });

    it("toggle opens when closed", () => {
      const { result } = renderHook(() => useDisclosure({ defaultOpen: false }));
      act(() => { result.current.toggle(); });
      expect(result.current.open).toBe(true);
    });

    it("setOpen sets to true", () => {
      const { result } = renderHook(() => useDisclosure({ defaultOpen: false }));
      act(() => { result.current.setOpen(true); });
      expect(result.current.open).toBe(true);
    });

    it("setOpen sets to false", () => {
      const { result } = renderHook(() => useDisclosure({ defaultOpen: true }));
      act(() => { result.current.setOpen(false); });
      expect(result.current.open).toBe(false);
    });

    it("toggle alternates on repeated calls", () => {
      const { result } = renderHook(() => useDisclosure({ defaultOpen: true }));
      act(() => { result.current.toggle(); });
      act(() => { result.current.toggle(); });
      act(() => { result.current.toggle(); });
      expect(result.current.open).toBe(false);
    });
  });

  describe("controlled", () => {
    it("uses the controlled open value", () => {
      const { result } = renderHook(() => useDisclosure({ open: false }));
      expect(result.current.open).toBe(false);
    });

    it("toggle does not change open when controlled", () => {
      const { result } = renderHook(() => useDisclosure({ open: true }));
      act(() => { result.current.toggle(); });
      expect(result.current.open).toBe(true);
    });

    it("setOpen does not change open when controlled", () => {
      const { result } = renderHook(() => useDisclosure({ open: true }));
      act(() => { result.current.setOpen(false); });
      expect(result.current.open).toBe(true);
    });
  });

  describe("onOpenChange", () => {
    it("calls onOpenChange when toggle is called", () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useDisclosure({ defaultOpen: true, onOpenChange })
      );
      act(() => { result.current.toggle(); });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls onOpenChange when setOpen is called", () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useDisclosure({ defaultOpen: false, onOpenChange })
      );
      act(() => { result.current.setOpen(true); });
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("calls onOpenChange even in controlled mode", () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useDisclosure({ open: true, onOpenChange })
      );
      act(() => { result.current.toggle(); });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
