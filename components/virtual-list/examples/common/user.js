import { Random } from './mock'

const getRandomAvatar = () => {
  return `https://avatars1.githubusercontent.com/u/${Random.integer(10000, 99999)}`
}

export default ((count = 0) => () => {
  return {
    name: ++count + '-' + Random.name(),
    avatar: getRandomAvatar()
  }
})();
