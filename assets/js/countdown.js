class Countdown {
  constructor() {
    this.secondsTotals = 0;
    this.cancel = false;
    this.cbSuscribesOnFinish = [];
    this.cbSuscribesOnTime = [];
    this.startCountdown = this.startCountdown.bind(this);
    this.cancelCountdown = this.cancelCountdown.bind(this);
    this.startDecrement = this.startDecrement.bind(this);
    this.covertToSecondsAndMinutes = this.covertToSecondsAndMinutes.bind(this);
    this.covertDurationToString = this.covertDurationToString.bind(this);
    this.suscribeOnFinish = this.suscribeOnFinish.bind(this);
    this.suscribeOnTime = this.suscribeOnTime.bind(this);
  }

  suscribeOnFinish(cb) {
    if (typeof cb === 'function') this.cbSuscribesOnFinish.push(cb);
  }
  
  suscribeOnTime(cb) {
    if (typeof cb === 'function') this.cbSuscribesOnTime.push(cb);
  }

  startCountdown(minutes) {
    this.secondsTotals = minutes * 60;
    setTimeout(this.startDecrement, 60 );
  }

  cancelCountdown() {
    this.cancel = true;
  }
  
  startDecrement() {  
    if (this.secondsTotals > 0) { 
      if (this.cancel) return clearTimeout(this.startDecrement);
      this.secondsTotals--;	
      const time = this.covertToSecondsAndMinutes(this.secondsTotals);
      this.cbSuscribesOnTime.forEach((cb) => cb(time));
      setTimeout(this.startDecrement, 1000)
    } else {
      clearTimeout(this.startDecrement)
      this.cbSuscribesOnFinish.forEach((cb) => cb());
    }
  
  }
  
  covertToSecondsAndMinutes(seconds) {
    const min = Math.floor(seconds / 60)
    const sec = Math.floor(seconds - min * 60)
    const m = this.covertDurationToString(min);
    const s = this.covertDurationToString(sec)
  
    return `${m}:${s}`
  }

  covertDurationToString(duration) {
    if (duration < 10) return `0${duration}`;
    return duration.toString();
  }

}


