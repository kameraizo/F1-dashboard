function CircuitAmbient() {
  return (
    <div className="ambient-track" aria-hidden="true">
      <svg viewBox="0 0 620 350" xmlns="http://www.w3.org/2000/svg">
        <path
          className="ambient-track__path"
          d="M20,140 C20,60 90,20 180,20 L460,20 C540,20 560,60 560,110 C560,160 520,190 460,190 L220,190 C160,190 140,220 140,260 C140,300 170,330 220,330 L520,330 C580,330 600,290 600,260"
        />
        <circle className="ambient-track__car" r="5" />
      </svg>
    </div>
  )
}

export default CircuitAmbient
