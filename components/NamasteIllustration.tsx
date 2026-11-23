import Image from "next/image";

/** Team RESCUEN's Namaste, shown beside the contribution form. */
export default function NamasteIllustration({
  celebrating = false,
  amount,
  priority = false,
}: {
  celebrating?: boolean;
  amount?: number;
  priority?: boolean;
}) {
  const rupees =
    amount && amount >= 1
      ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
      : null;

  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      <div className="namaste-frame relative overflow-hidden rounded-[1.75rem] p-[3px]">
        <div className="relative overflow-hidden rounded-[1.6rem] bg-[#fff6e6]">
          <Image
            src="/daan/namaste.webp"
            alt="A young woman in a blue silk saree and a young man in a kurta and RESCUEN vest greeting you with a Namaste"
            width={1213}
            height={1297}
            quality={75}
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
            sizes="(max-width: 520px) 84vw, 460px"
            className="namaste-photo h-auto w-full"
          />
          <span className="namaste-sheen" aria-hidden="true" />
          {celebrating && (
            <span className="pointer-events-none absolute inset-0" aria-hidden="true">
              {[12, 28, 46, 63, 80].map((left, i) => (
                <i key={left} className="namaste-heart" style={{ left: `${left}%`, animationDelay: `${i * 0.5}s` }} />
              ))}
            </span>
          )}
        </div>
      </div>
      <p
        key={celebrating ? "thanks" : rupees || "hello"}
        className="menu-pop relative mx-auto mt-4 w-fit max-w-full rounded-full border border-gold-300/70 bg-white px-4 py-2 text-center text-[13px] font-bold text-ink shadow-gold"
      >
        {celebrating ? (
          "Thank you from the bottom of our hearts"
        ) : rupees ? (
          <>Namaste! Your support: {rupees}</>
        ) : (
          "Namaste! Thank you for standing with us"
        )}
      </p>
    </div>
  );
}
