<template>
  <div>
    <h3>input 框</h3>
    <Input width="360px" desc="字段描述" placeholder="请输入" />
    <h3 style="margin-top: 32px">textarea</h3>
    <Input width="360px" textarea maxlength="48" desc="字段描述" placeholder="请输入" errMsg="错误信息" />
    <svg enable-background="new 0 0 48 48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m21.2 44.8-18-18c-1.6-1.6-1.6-4.1 0-5.7l18-18c1.6-1.6 4.1-1.6 5.7 0l18 18c1.6 1.6 1.6 4.1 0 5.7l-18 18c-1.6 1.6-4.2 1.6-5.7 0z"
        fill="#f44336"
      />
      <path
        d="m21.6 32.7c0-.3.1-.6.2-.9s.3-.5.5-.7.5-.4.8-.5.6-.2 1-.2.7.1 1 .2.6.3.8.5.4.4.5.7.2.6.2.9-.1.6-.2.9-.3.5-.5.7-.5.4-.8.5-.6.2-1 .2-.7-.1-1-.2-.5-.3-.8-.5c-.2-.2-.4-.4-.5-.7s-.2-.5-.2-.9zm4.2-4.6h-3.6l-.5-15.1h4.6z"
        fill="#fff"
      />
    </svg>
    <svg
      width="30px"
      height="30px"
      viewBox="0 0 30 30"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <title>icon_failed</title>
      <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <image
          id="icon_failed"
          x="-2"
          y="0"
          width="32"
          height="32"
          xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAACshmLzAAACHklEQVRYCd1XwU6DQBDdBY22XnuxR3/Bqyb9gB5MNNGPKNKbiV646KmHIv0ITTTxE5ro1d9oL73a2kS6ztt2ERBSlkJrnIQsLDPvPYZhd+BM0ya2fSRmsxMmxCGF1hcHUAby4PydG8ZLxXXfMLnM+DIH3BeOszsZjS7ptC0Y288SQ8BD8utWarV77jifaTFLBYxt+5T5vpeVOE4khZimVXXd5/g9XBtJk2ruw7Juhe8/5SUHDmKBASyFGx5TMzC2rAchxHnYedVzzvlj1fMuwjiJGZBPXjA5SPFA8Uz8ygDeOVIWVln0OTfNM1UTkQyg2lFwWQm3m01W6XQYRi1DUYOLLCIAn5pOwW01Gozv7DCMOgaOxWcdFUAgbR0gkMPUqBNLvpIryIBc4TIuMppEie4yC7SqBgLk8proWt4kOAMBi7W9PLYkZNpPfgTMN5YktzLn6n9KQJlPmoodzgD283XbYCUBYjqVgtWYQ31IAHUyugBf/T4DOcZchu5JBWIhmvn+q7pex2iY5nEgAITjVmugsxesIpKIh9VeL/IZAq+rA5p7N5yTSK5wETLZQM6byUw68u6GeHpwgSQiQHav1EBmYien3EVIHKpTjtSAIpZtkxDX6rrQkfO7Pc+7UZiJAnBzo00pBMjuldTivBAjrHhHDNzUDCjSjf6YQAS6V6rYA1J6RQd+tzIZfBGDWNUBJwWSj54V/XOqx/4fvb8BCSvWiyARPFAAAAAASUVORK5CYII="
        ></image>
      </g>
    </svg>
    <svg t="1645603289396" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1739" width="200" height="200"><path d="M512 71.274667l373.333333 176.362666v302.698667c0 162.048-133.034667 332.224-344.682666 392.469333l-8.853334 2.453334-19.797333 5.12-20.032-5.184C282.026667 889.045333 146.730667 724.096 138.986667 563.029333l-0.256-6.890666-0.064-308.48L512 71.253333z m-0.021333 70.784l-309.333334 146.112 0.085334 267.136c3.285333 129.6 112.789333 269.354667 288.341333 323.072l8.533333 2.538666 8.661334 2.389334 3.690666 0.96 3.541334-0.896c183.104-48.981333 298.581333-189.141333 305.493333-320.554667l0.256-6.250667 0.085333-6.229333V288.170667L511.978667 142.058667z m104.704 237.141333l45.248 45.248-203.648 203.648-143.296-143.296 45.248-45.248 98.026666 98.048 158.421334-158.4z" fill="#1677FF" p-id="1740"></path></svg>
  </div>
</template>

<script>
import Input from '../src/input.vue';
export default {
  components: { Input },
};
</script>
