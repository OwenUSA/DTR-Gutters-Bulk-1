export default function QuoteForm({ className = "" }: { className?: string }) {
  return (
    <form
      id="quote"
      className={`bg-white text-[#222] p-[30px] rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.2)] ${className}`}
    >
      <h3 className="mb-5 text-center text-navy">Get a Free Estimate</h3>
      <input type="text" placeholder="Full Name" required className="w-full p-3 mb-3 border border-[#ddd] rounded-[5px] text-[0.95rem]" />
      <input type="tel" placeholder="Phone Number" required className="w-full p-3 mb-3 border border-[#ddd] rounded-[5px] text-[0.95rem]" />
      <input type="email" placeholder="Email Address" required className="w-full p-3 mb-3 border border-[#ddd] rounded-[5px] text-[0.95rem]" />
      <input type="text" placeholder="ZIP Code" required className="w-full p-3 mb-3 border border-[#ddd] rounded-[5px] text-[0.95rem]" />
      <select required className="w-full p-3 mb-3 border border-[#ddd] rounded-[5px] text-[0.95rem] bg-white">
        <option value="">Service Type</option>
        <option>Seamless Gutter Installation</option>
        <option>Gutter Guards / Leaf Protection</option>
        <option>Gutter Cleaning</option>
        <option>Gutter Repair</option>
        <option>Downspout Work</option>
        <option>Other / Not Sure</option>
      </select>
      <button type="submit" className="btn btn-cta btn-full">Request Free Estimate</button>
    </form>
  );
}
