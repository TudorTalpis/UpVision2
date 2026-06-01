/* Shown in the page area while a lazy route chunk loads. Matches the
   hero + content rhythm so the layout doesn't jump when content arrives. */
export default function Skeleton() {
  return (
    <div className="shell pt-40 pb-24 min-h-[80vh]" aria-hidden="true" role="status" aria-label="Loading">
      <div className="sk h-3.5 w-44 mb-9" />
      <div className="space-y-3 mb-9">
        <div className="sk h-[clamp(34px,6vw,72px)] w-[72%]" />
        <div className="sk h-[clamp(34px,6vw,72px)] w-[48%]" />
      </div>
      <div className="space-y-3 max-w-[52ch]">
        <div className="sk h-4 w-full" />
        <div className="sk h-4 w-[92%]" />
        <div className="sk h-4 w-[68%]" />
      </div>
      <div className="mt-12 grid sm:grid-cols-3 gap-5 max-w-3xl">
        <div className="sk h-44" />
        <div className="sk h-44" />
        <div className="sk h-44" />
      </div>
    </div>
  )
}
