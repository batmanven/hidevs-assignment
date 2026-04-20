export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-2 border-stone-300 rounded-full" />
        <div className="absolute inset-0 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )
}
