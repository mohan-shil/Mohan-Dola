import { useEffect, useRef, useState } from "react";

const weddingDate = new Date("2027-10-13T10:30:00+06:00");

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, className: `reveal ${visible ? "is-visible" : ""}` };
}

function useCountdown() {
  const getTime = () => {
    const distance = Math.max(0, weddingDate.getTime() - Date.now());
    return {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance / 3600000) % 24),
      minutes: Math.floor((distance / 60000) % 60),
      seconds: Math.floor((distance / 1000) % 60)
    };
  };
  const [time, setTime] = useState(getTime);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getTime()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return time;
}

function Monogram() {
  return <span className="monogram">M<span>&amp;</span>D</span>;
}

function Button({ children, light = false, onClick, href }) {
  const className = `button ${light ? "button-light" : "button-dark"}`;
  return href ? <a className={className} href={href}>{children}</a> : <button className={className} type="button" onClick={onClick}>{children}</button>;
}

function Hero() {
  return <section className="hero" id="top">
    <div className="hero-image" aria-hidden="true" />
    <div className="hero-orbit orbit-one" aria-hidden="true" />
    <div className="hero-orbit orbit-two" aria-hidden="true" />
    <div className="hero-bloom" aria-hidden="true"><span /><span /><span /></div>
    <nav className="nav wrap" aria-label="Main navigation">
      <a href="#top" aria-label="Mohan and Diya home"><Monogram /></a>
      <div className="nav-links"><a href="#story">Our story</a><a href="#details">The day</a><a href="#rsvp">RSVP</a></div>
    </nav>
    <div className="hero-content wrap">
      <p className="eyebrow">Together with their families</p>
      <h1>Mohan <em>&amp;</em> Diya</h1>
      <p className="hero-copy">invite you to celebrate the beginning<br />of their forever.</p>
      <div className="hero-date"><span>11 &amp; 13 October 2027</span><i /><span>Chattogram</span></div>
      <Button href="#details" light>Explore the invitation <span>↓</span></Button>
    </div>
    <div className="scroll-note">Scroll to discover <span>↓</span></div>
  </section>;
}

function Story() {
  const label = useReveal();
  const content = useReveal();
  return <section className="intro section-pad" id="story"><div className="wrap narrow intro-grid">
    <p ref={label.ref} className={label.className}>01 / A little about us</p>
    <div ref={content.ref} className={`${content.className} reveal-delay`}><h2>Two paths,<br /><em>one beautiful</em> beginning.</h2><p className="body-copy">From a chance hello to a thousand small memories, our story has always felt like a little bit of magic. Now, we are making it official with the people who make our world complete.</p><p className="signature">With love,<br /><span>Mohan &amp; Diya</span></p></div>
  </div></section>;
}

const events = [
  { number: "01", type: "11 October 2027", name: "Engagement", time: "Shoronika", period: "Chattogram", place: <>Shoronika<br />Chattogram</>, map: "https://maps.app.goo.gl/n48wkc3DhTEyxQpX7" },
  { number: "02", type: "13 October 2027", name: "Wedding", time: "Shoronika", period: "Chattogram", place: <>Shoronika<br />Chattogram</>, map: "https://maps.app.goo.gl/n48wkc3DhTEyxQpX7", featured: true }
];

function EventCard({ event }) {
  return <article className={`event-card ${event.featured ? "featured-event" : ""}`}><p className="event-number">{event.number}</p><p className="event-type">{event.type}</p><h3>{event.name}</h3><p className="event-time">{event.time} <span>{event.period}</span></p><p className="event-place">{event.place}</p><a className="text-link" href={event.map} target="_blank" rel="noreferrer">View on map <span>↗</span></a></article>;
}

function Details() {
  const heading = useReveal();
  const cards = useReveal();
  return <section className="details section-pad" id="details"><div className="wrap"><div ref={heading.ref} className={heading.className}><p className="section-label">02 / Join us</p><h2>The day we’ve<br /><em>been dreaming of.</em></h2></div><div ref={cards.ref} className={`${cards.className} reveal-delay event-grid`}>{events.map((event) => <EventCard key={event.number} event={event} />)}</div></div></section>;
}

function Countdown() {
  const time = useCountdown();
  const reveal = useReveal();
  return <section className="countdown section-pad"><div className="countdown-sparkle sparkle-one" aria-hidden="true">✦</div><div className="countdown-sparkle sparkle-two" aria-hidden="true">✦</div><div className="wrap countdown-inner"><p ref={reveal.ref} className={`${reveal.className} section-label`}>The countdown begins</p><div className="timer" aria-label="Countdown to the wedding">{Object.entries(time).map(([unit, value], index) => <div className="timer-unit" key={unit}><strong>{String(value).padStart(2, "0")}</strong><span>{unit}</span>{index < 3 && <i />}</div>)}</div></div></section>;
}

function RsvpModal({ onClose }) {
  const [message, setMessage] = useState("");
  const submit = (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); setMessage(`Thank you, ${data.get("name")}. We cannot wait to celebrate with you!`); event.currentTarget.reset(); };
  return <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="modal-panel"><button className="modal-close" type="button" onClick={onClose} aria-label="Close RSVP form">×</button><p className="section-label">RSVP / 2027</p><h2 id="modalTitle">Will we see<br /><em>you there?</em></h2><form onSubmit={submit}><label>Your name<input required type="text" name="name" placeholder="Aarav Sharma" /></label><label>Will you join us?<select name="attendance"><option>Joyfully accepts</option><option>Regretfully declines</option></select></label><Button>Send RSVP <span>→</span></Button></form><p className="form-message" aria-live="polite">{message}</p></div></div>;
}

function App() {
  const [isRsvpOpen, setRsvpOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = isRsvpOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [isRsvpOpen]);
  return <><main><Hero /><Story /><Details /><Countdown /><section className="rsvp section-pad" id="rsvp"><div className="wrap rsvp-inner"><p className="section-label">03 / We hope you can make it</p><h2>Come for the love,<br /><em>stay for the dancing.</em></h2><p className="body-copy">Your presence is the only present we need. Please let us know if you’ll be joining us by 01 September 2027.</p><Button onClick={() => setRsvpOpen(true)}>Confirm your attendance <span>→</span></Button></div></section><footer className="footer"><div className="wrap footer-inner"><Monogram /><p>Made with love for our favourite people.</p><a href="#top" aria-label="Back to top">↑</a></div></footer></main>{isRsvpOpen && <RsvpModal onClose={() => setRsvpOpen(false)} />}</>;
}

export default App;