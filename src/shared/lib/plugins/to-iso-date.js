export default (option, dayjsClass) => {
  dayjsClass.prototype.toISODate = function () {
    return this.format('YYYY-MM-DD');
  };
};
