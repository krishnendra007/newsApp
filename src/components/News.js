import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";


//import PropTypes from 'prop-types'
export class News extends Component {

  static defaultProps = {
    country: 'in',
    pageSize: 12,
    category: 'general'
  }
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults:0
    };
    document.title = `NewsApp | ${this.props.category}`;
  }

 

  async updateNews(pageNo) {
    this.props.setProgress(10);

    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=718d27508a3d425aa3fd95fad0a4db28&pagesize=${this.props.pageSize}&page=1`;
    this.setState({ loading: true })
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedata = await data.json();
    this.props.setProgress(60);
    this.setState({
      articles: parsedata.articles,
      totalResults: parsedata.totalResults,
      loading: false
    });

    this.props.setProgress(100);

  }



  async componentDidMount() {
    this.updateNews();
  }

  handlePrev = async () => {
    this.setState({page:this.state.page-1});
    this.updateNews();

  }
  handleNext = async () => {
    this.setState({page:this.state.page+1});
    this.updateNews();

  }

  fetchMoreData =  async() => {
    this.setState({page:this.state.page+1});
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=718d27508a3d425aa3fd95fad0a4db28&pagesize=${this.props.pageSize}&page=${this.state.page+1}`;
    let data = await fetch(url);
    let parsedata = await data.json();
    //console.log(parsedata);
    this.setState({
      articles:this.state.articles.concat( parsedata.articles),
      totalResults: parsedata.totalResults,
      loading: false
    });
  };


  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center">NewsApp to headlines</h1>
        <br />
        <h3 className="container my-2 " style={{ textAlign: 'center' }}>{this.props.category.charAt(0).toUpperCase() + this.props.category.slice(1)} Section</h3>
        {this.state.loading && <Spinner />}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length!==this.state.totalResults}
          loader={<Spinner/>}
        >

          <div className="container">

          <div className="row">
            {this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title}
                    description={element.description}
                    imageUrl={element.urlToImage ? element.urlToImage : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS2sRlULpZo5zSIWdlCAaHkCXrRUEG-9mFrc19z4J3PWeiuPArJgsy1VqOW9H6ybhdUps&usqp=CAU"}
                    newsUrl={element.url} author={element.author ? element.author : "Unknown"} date={element.publishedAt} source={element.source.name}
                  />
                </div>
              );
            })}
          </div>
          </div>

        </InfiniteScroll>

        {/*<div className="container d-flex justify-content-between">
          <button type="button" className="btn btn-dark" onClick={this.handlePrev} disabled={this.state.page <= 1}> &larr; Previous</button>
          <button type="button" className="btn btn-dark" onClick={this.handleNext} disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)}>Next &rarr;</button>
          </div>*/}
      </div>
    );
  }
}

export default News;
