import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import client from '../client';
import { Button } from 'react-bootstrap';

import ComposeTweet from './ComposeTweet';
import TweetList from './TweetList';

export default class App extends Component {
    constructor(){
        super();

        this.state = {
            showModal: false,
            tweets: []
        }
    }

    componentDidMount() {
        this.updateTweets();
    }

    addTweet(tweet) {
        client.addTweet(tweet)
            .then((response) => {
                const tweets = [response.data, ...this.state.tweets];

                this.setState({ tweets, showModal: false });
            }).catch((error) => {
                console.log(error);
            });
    }

    deleteTweet(id) {
        client.deleteTweet(id)
            .then(() => {
                const tweets = this.state.tweets.filter(tweet => tweet.id !== id);

                this.setState({ tweets });
            }).catch((error) => {
                console.log(error);
            });
    }

    likeTweet(id) {
        client.likeTweet(id)
            .then(() => {
                const tweets = this.state.tweets.map(tweet => {
                    tweet.like_count = tweet.id === id ? tweet.like_count + 1 : tweet.like_count;
                    return tweet;
                });

                this.setState({ tweets });
            }).catch((error) => {
            console.log(error);
        });
    }

    updateTweets() {
        client.getTweets()
            .then(response => {
                this.setState({ tweets: response.data.reverse() });
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <Button bsStyle="primary" bsSize="large" onClick={ () => { this.setState({ showModal: true }) }}>
                    Compose Tweet <i className="ion-edit" style={{ paddingLeft: '5px' }} />
                </Button>

                <span className="pull-right">
                    <Button bsStyle="info" bsSize="large" onClick={ () => { this.updateTweets() }}>
                    <i className="ion-android-refresh" />
                </Button>

                </span>

                <ComposeTweet addTweet={ (tweet) => this.addTweet(tweet) }
                              showModal={ this.state.showModal }
                              close={ () => this.setState({ showModal: false }) } />

                <hr />

                <TweetList likeTweet={ (id) => this.likeTweet(id) } deleteTweet={ (id) => this.deleteTweet(id) } tweets={ this.state.tweets } />
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('example'));
