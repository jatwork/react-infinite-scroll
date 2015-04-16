module.exports = function (React) {
  if (React.addons && React.addons.InfiniteScroll) {
    return React.addons.InfiniteScroll;
  }
  React.addons = React.addons || {};
  var InfiniteScroll = React.addons.InfiniteScroll = React.createClass({
    getDefaultProps: function () {
      return {
        pageStart: 0,
        hasMore: false,
        loadMore: function () {},
        threshold: 250,
        loader: null,
        component: React.DOM.div
      };
    },
    getInitialState: function () {
      this.pageLoaded = this.props.pageStart;
      this.updated = true;
      return null;
    },
    componentDidMount: function () {
      this.attachScrollListener();
    },
    componentDidUpdate: function (prevProps) {
      this.updated = true;
      if (prevProps.hasMore === this.props.hasMore) return;

      if (!this.props.hasMore) {
        this.detachScrollListener();
      }
      else {
        this.attachScrollListener();
      }
    },
    render: function () {
      var props = this.props;
      return props.component(extend({}, this.props, {
        pageStart: null
      , hasMore: null
      , loadMore: null
      , threshold: null
      , loader: null
      , component: null
      }), props.children, props.hasMore && props.loader);
    },
    scrollListener: function () {
      if (!this.updated) return;
      var coords = this.getDOMNode().getBoundingClientRect();

      if (coords.bottom < window.innerHeight + this.props.threshold) {
        this.updated = false;
        this.props.loadMore(this.pageLoaded += 1);
      }
    },
    attachScrollListener: function () {
      if (!this.props.hasMore) {
        return;
      }
      window.addEventListener('scroll', this.scrollListener);
      this.scrollListener();
    },
    detachScrollListener: function () {
      window.removeEventListener('scroll', this.scrollListener);
    },
    componentWillUnmount: function () {
      this.detachScrollListener();
    }
  });
  return InfiniteScroll;
};

function extend(obj) {
  var source, prop;
  for (var i = 1, length = arguments.length; i < length; i++) {
    source = arguments[i];
    for (prop in source) {
      if (hasOwnProperty.call(source, prop)) {
          obj[prop] = source[prop];
      }
    }
  }
  return obj;
}
