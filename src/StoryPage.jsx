import { useEffect, useRef, useState } from "react";

function Monogram() {
  return <span className="monogram">M<span>&amp;</span>D</span>;
}

const storyYears = [
  { year: "2016", title: "The beginning", role: "Our first chapter", copy: "The year our story began. One hello became a reason to keep talking, and then a reason to keep choosing each other." },
  { year: "2017", title: "Learning each other", role: "Two lives, one rhythm", copy: "We started collecting the little things: shared jokes, long conversations, and the comfort of being completely ourselves." },
  { year: "2018", title: "Growing together", role: "A steady kind of love", copy: "Every ordinary day became part of something extraordinary. We learned that love lives just as much in the small moments." },
  { year: "2019", title: "Two paths, one team", role: "Making room for dreams", copy: "Mohan continued building as a developer, while Diya followed her calling in dentistry. We became each other's favourite support system." },
  { year: "2020", title: "Choosing us", role: "Through every season", copy: "When the world became quieter, we found even more reasons to be grateful for the person beside us." },
  { year: "2021", title: "More memories", role: "The everyday magic", copy: "The years kept moving, filled with plans, laughter, and the kind of memories we will tell again and again." },
  { year: "2022", title: "A bigger dream", role: "Looking ahead", copy: "We began imagining the future in the same sentence and making space for all the beautiful things still to come." },
  { year: "2023", title: "Our favourite people", role: "Love, shared", copy: "Our story became even more special because of the family and friends who have cheered for us along the way." },
  { year: "2024", title: "Still choosing you", role: "The best kind of sure", copy: "After all the seasons, the answer was still easy: you. Every day, in all the ways that matter." },
  { year: "2025", title: "The promise takes shape", role: "Almost time", copy: "The future started to feel close enough to touch. We knew the next chapter would be the one we had been waiting for." },
  { year: "2026", title: "Getting ready", role: "Our next chapter", copy: "With our favourite people close, we began preparing to celebrate the love that brought us here." },
  { year: "2027", title: "Two celebrations", role: "11 & 13 October / Chattogram", copy: "Our engagement on 11 October and our wedding on 13 October. We cannot wait to begin this chapter with you." }
];

function PhotoSlot({ image, year, onChange }) {
  const inputRef = useRef(null);
  return <div className={`timeline-photo ${image ? "has-image" : ""}`} style={image ? { backgroundImage: `url(${image})` } : undefined}>
    {!image && <><span className="photo-icon">+</span><span>Add a photo</span></>}
    {image && <span className="photo-caption">{year} memory</span>}
    <input ref={inputRef} type="file" accept="image/*" onChange={onChange} aria-label={`Add a photo for ${year}`} />
    <button type="button" className="photo-action" onClick={() => inputRef.current?.click()}>{image ? "Change photo" : "Choose photo"}</button>
  </div>;
}

function TimelineItem({ moment, index, image, onPhotoChange }) {
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
    }, { threshold: 0.18 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <article ref={ref} className={`timeline-item ${visible ? "is-visible" : ""} ${index % 2 ? "is-reversed" : ""}`}>
    <div className="timeline-marker" aria-hidden="true"><span>{moment.year.slice(2)}</span></div>
    <div className="timeline-card">
      <div className="timeline-card-copy"><p className="timeline-year">{moment.year}</p><p className="timeline-role">{moment.role}</p><h2>{moment.title}</h2><p>{moment.copy}</p></div>
      <PhotoSlot image={image} year={moment.year} onChange={onPhotoChange} />
    </div>
  </article>;
}

function AddMemory({ onAdd }) {
  const [form, setForm] = useState({ year: "", title: "", copy: "", image: "" });
  const [fileName, setFileName] = useState("");
  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setForm((current) => ({ ...current, image: URL.createObjectURL(file) }));
  };
  const submit = (event) => {
    event.preventDefault();
    if (!form.year || !form.title || !form.copy) return;
    onAdd({ ...form, year: String(form.year), role: "A memory from our people" });
    setForm({ year: "", title: "", copy: "", image: "" });
    setFileName("");
    event.currentTarget.reset();
  };
  return <section className="memory-form-section" aria-labelledby="memory-form-title">
    <div className="wrap memory-form-grid"><div><p className="section-label">Leave a little love</p><h2 id="memory-form-title">Add your<br /><em>chapter.</em></h2><p className="body-copy">Have a memory with us? Add it to the timeline for this visit.</p></div><form className="memory-form" onSubmit={submit}><label>Year<input required type="number" min="2016" max="2027" placeholder="2021" value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })} /></label><label>Memory title<input required type="text" placeholder="The best surprise" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label><label>Your note<textarea required rows="3" placeholder="Tell us what you remember..." value={form.copy} onChange={(event) => setForm({ ...form, copy: event.target.value })} /></label><label className="memory-upload">Photo <span>{fileName || "Optional"}</span><input type="file" accept="image/*" onChange={handleFile} /></label><button className="button button-dark" type="submit">Add to our story <span>→</span></button></form></div>
  </section>;
}

export default function StoryPage() {
  const [memories, setMemories] = useState([]);
  const [photos, setPhotos] = useState({});
  const addMemory = (memory) => setMemories((current) => [...current, memory]);
  const setPhoto = (year, event) => {
    const file = event.target.files[0];
    if (file) setPhotos((current) => ({ ...current, [year]: URL.createObjectURL(file) }));
  };
  const moments = [...storyYears, ...memories].sort((first, second) => Number(first.year) - Number(second.year));
  return <main className="story-page">
    <nav className="nav wrap story-nav" aria-label="Story navigation"><a href="/" aria-label="Return to invitation"><Monogram /></a><a className="story-back" href="/">Back to invitation <span>↗</span></a></nav>
    <header className="story-hero wrap"><p className="section-label">Our story / 2016 - 2027</p><h1>One story,<br /><em>year by year.</em></h1><p>From the first hello to two beautiful celebrations, these are the chapters that brought us here.</p><a className="story-scroll" href="#timeline">Begin the story <span>↓</span></a></header>
    <section className="timeline" id="timeline" aria-label="Our story timeline">{moments.map((moment, index) => <TimelineItem key={`${moment.year}-${moment.title}`} moment={moment} index={index} image={moment.image || photos[moment.year]} onPhotoChange={(event) => setPhoto(moment.year, event)} />)}</section>
    <AddMemory onAdd={addMemory} />
    <footer className="story-footer"><div className="wrap footer-inner"><Monogram /><p>Made with love for our favourite people.</p><a href="#timeline" aria-label="Back to timeline">↑</a></div></footer>
  </main>;
}
