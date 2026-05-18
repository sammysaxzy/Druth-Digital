export function LoadingButton({ isLoading, children, ...props }) {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? "Submitting..." : children}
    </button>
  );
}
