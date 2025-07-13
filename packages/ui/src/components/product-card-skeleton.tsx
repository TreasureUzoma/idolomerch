export const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col gap-3">
      <div className="w-full h-[180px] rounded-2xl bg-primary/20" />
      <div className="h-4 w-3/4 rounded bg-primary/20" />
      <div className="h-6 w-1/2 rounded-xl bg-primary/20" />
    </div>
  )
}
