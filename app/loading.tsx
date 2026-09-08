export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white">
      <video
        src="/video/logo-loading.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="h-40 w-40 object-contain"
      />
    </div>
  );
}
