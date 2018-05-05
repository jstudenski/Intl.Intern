import React, { Component } from 'react';
import firebase from 'firebase';
import AddChapter from './AddChapter';
import ChapterCard from './ChapterCard';
import API from '../../utils/API';

var config = {
	apiKey: process.env.REACT_APP_FIREBASE_apikey,
	authDomain: process.env.REACT_APP_FIREBASE_authDomain,
	databaseURL: process.env.REACT_APP_FIREBASE_databaseURL,
	projectId: process.env.REACT_APP_FIREBASE_projectId,
	storageBucket: "intern-project-4b679.appspot.com",
	// storageBucket: process.env.REACT_APP_FIREBASE_storageBucket,
	messagingSenderId: process.env.REACT_APP_FIREBASE_messagingSenderId,
};

firebase.initializeApp(config);

export default class extends Component {
  
	state= {
		chapterTitle: "",
		description: "",
		image:"",
		date: "",
		requireNum: 0,
		chapterData:[],
		needsData: [],
	};

	componentDidMount() {
		API.getCurrentUser().then(response=> {
			let currentUser = response.data.user
			this.setState({currentUser: currentUser});
		}).catch(err =>{
			console.log("Error while getting current user: ", err)
		})

		API.getChapters().then(response=> {
			this.setState({
				chapterData: response.data
			})
		}).catch(err =>{
			console.log("Error while getting chapters: ", err)
		})

		API.getNeeds().then(res => {
			this.setState({
			  needsData:res.data
			})
		}).catch(err=>{
			console.log("Error while getting needs: ", err)
		});
	}

	handleInputChange = (event) => this.setState({
    	[event.target.name]: event.target.value,
 	})

	handleFormSubmit = (event) => {
	  event.preventDefault();
	  if (this.state.chapterTitle && this.state.description && this.state.date !== "") {
	    console.log('current state', this.state);
	    let fileButton = document.getElementById("fileButton");
	    let file = fileButton.files[0];
	    // console.log(file.name);
	    console.log(file);
        
	    if (this.state.image !== ""){
	      // let file = fileButton.files[0];
	      let image = "";
	      //create storage ref
	      let storageRef = firebase.storage().ref("chapImg/" + Date.now() + file.name);
	      //upload file
	      let task = storageRef.put(file);	
		    task.on('state_changed', 
			  (snapshot) => {
			    console.log("SNAPSHOT:", snapshot);
			  }, 
			  (err) => {
			  },
			  () => {
			    console.log("COMPLETE");
			    storageRef.getDownloadURL().then((url) => {
				  image = url;
				  let data = {
				  	chapTitle: this.state.chapterTitle,
				  	chapNote: this.state.description,
				  	chapImg: image,
				  	reqNum: this.state.requireNum,
				  	chapDate: this.state.date,
				  };

				  API.addChapter(data).then((response) => {
				  	console.log("Response from adding chapter: ", response);
				  	this.setState({
				  	  chapterTitle:"",
				  	  description: "",
				  	  image:"",
				  	  date: "",
					});
				  })
				  .catch((err) => {
			  	  	console.log('Error while adding chapter: ', err);
				  })

				  API.getChapters().then((response) => {
					this.setState({
				  	  chapterData:response.data
					});
			  	  });
		  	    });
		      }
		    )
		} else{

		  // let image = "";
	   //    //create storage ref
	   //    let storageRef = "";
	   //    //upload file
	   //    let task = storageRef.put(file);	
		  let data = {
		  	chapTitle: this.state.chapterTitle,
		  	chapNote: this.state.description,
		  	reqNum: this.state.requireNum,
		  	chapDate: this.state.date,
		  };

		  API.addChapter(data).then((response) => {
		  	console.log("Response from adding chapter: ", response);
		  	this.setState({
		  	  chapterTitle:"",
		  	  description: "",
		  	  date: "",
		  	  requireNum:"",
			});
		  })
		  .catch((err) => {
	  	  	console.log('Error while adding chapter: ', err);
		  })

		  API.getChapters().then((response) => {
			this.setState({
		  	  chapterData:response.data
			});
	  	  });
		};
	  } else {
		console.log("Unable to add chapter.")
	  }
	}

	render() {
		return (
			<div>
		    	<AddChapter 
		    	  needs={this.state.needsData}
		    	  handleInputChange={this.handleInputChange} 
		    	  handleFormSubmit={this.handleFormSubmit} 
		    	  {...this.state}/>
		    	<ChapterCard chapters={this.state.chapterData} />
		  	</div>
		);
	}
}