<template>

  <div class="my-element">
    welcome
    <div class="card">
      <p class="time-text">
        <span>{{ currentTime.hours }}</span>:<span>{{ currentTime.minutes }}</span>
        <span class="time-sub-text">{{ currentTime.period }}</span>
      </p>
      <p class="day-text">{{ currentDate }}</p>
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" stroke-width="0" fill="currentColor" stroke="currentColor" class="moon"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path></svg>
    </div>

      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <p class="title">Hover Me</p>
          </div>
          <div class="flip-card-back">
            <p class="title">Welcome</p>
            <p class="page1">Manage System</p>
          </div>
        </div>
      </div>

  </div>
</template>

<script>
import 'animate.css';
import Data from "./Data.vue";
export default{
  name: 'Home',
  components: {
    Data
  },
  data() {
    return {
      currentTime: {
        hours: '',
        minutes: '',
        period: ''
      },
      currentDate: ''
    };
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const isAm = hours < 12;

      // Format hours for 12-hour format
      hours = hours % 12 || 12;

      // Update the currentTime data property
      this.currentTime = {
        hours: hours.toString(),
        minutes: minutes < 10 ? '0' + minutes.toString() : minutes.toString(),
        period: isAm ? 'AM' : 'PM'
      };

      // Update the currentDate data property
      this.currentDate = this.formatDate(now);
    },
    formatDate(date) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const dayName = dayNames[date.getDay()];
      const monthName = monthNames[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      const ordinal = this.getOrdinalIndicator(day);

      return `${dayName}, ${monthName} ${day}${ordinal} ${year}`;
    },
    getOrdinalIndicator(day) {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }
  },
  mounted() {
    this.updateDateTime(); // Update on initial mount
    setInterval(this.updateDateTime, 60000); // Update every minute
  }


// 每分钟更新时间
}
</script>

<style>
.my-element {
  display: inline-block;
  margin: 0 0.5rem;

  animation: bounce; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 2s; /* don't forget to set a duration! */
}

.card {
  width: 280px;
  height: 150px;
  background: rgba(236, 160, 160, 0.2);
  border-radius: 15px;
  box-shadow: rgba(74, 47, 99, 0.4) 5px 10px 50px , rgba(72, 47, 99, 0.28) -5px 0px 250px;
  display: flex;
  color: white;
  justify-content: center;
  position: relative;
  flex-direction: column;
  background: linear-gradient(to right, rgba(236, 160, 160, 0.2), rgba(236, 160, 160, 0.5));
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.card:hover {
  box-shadow: rgba(236, 160, 160, 0.2) 5px 10px 50px , rgb(236, 160, 160) -5px 0px 250px;
}

.time-text {
  font-size: 50px;
  margin-top: 0px;
  margin-left: 15px;
  font-weight: 600;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.time-sub-text {
  font-size: 15px;
  margin-left: 5px;
}

.day-text {
  font-size: 18px;
  margin-top: 0px;
  margin-left: 15px;
  font-weight: 500;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.moon {
  font-size: 20px;
  position: absolute;
  right: 15px;
  top: 15px;
  transition: all 0.3s ease-in-out;
}

.card:hover > .moon {
  font-size: 23px;
}

.flip-card {
  margin-left: 400px;
  margin-top: -170px;
  background-color: transparent;
  width: 700px;
  height: 700px;
  perspective: 1000px;
  font-family: sans-serif;

}

.title {
  font-size: 5em;
  font-weight: 900;
  text-align: center;
  margin-top: 300px;
  color: rgb(236, 160, 160);
}
.page1{
  font-size: 3em;
  font-weight: 900;
  text-align: center;
  color: rgb(236, 160, 160);
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  box-shadow: 0 8px 14px 0 rgba(0,0,0,0.2);
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border: 1px solid #eca0a0;
  border-radius: 1rem;
}

.flip-card-front {
  color: #eca0a0;
  background-image: url('../assets/logo12.jpeg');
  background-size: cover;
  background-position: center;
}

.flip-card-back {
  color: white;
  transform: rotateY(180deg);
  background-image: url('../assets/logo5.gif');
  background-size: cover;
  background-position: center;
}

</style>