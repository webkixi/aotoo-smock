function forLeave(router) {
  return {
    main: function () {
      return <div>我是a3</div>
    },
    enter: function (data) {
      return this.main()
    },
    leave: function () {
      console.log('======= 3333');
    }
  }
}

module.exports = forLeave