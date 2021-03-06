Ext.define('CustomApp', {
    extend: 'Rally.app.TimeboxScopedApp',
    scopeType: 'iteration',
    
    // TODO Fix the layout
    /*layout: {
    	type: 'fit',
    	align: 'stretch'
    },*/
    
    //Define what to do when iteration is changed
    onScopeChange: function(scope){
    	
  
    	var iterationID = this.getContext().getTimeboxScope().getRecord().get("_ref");

    	
    	console.log('Iteration ID',iterationID);
    	
    	//Create a data store for User Iteration Capacity records
    	Ext.create('Rally.data.WsapiDataStore',{
    		model: 'User Iteration Capacity',
    		limit: 'Infinity',
    		pageSize: 200,
    		filters: [{property: 'Iteration', operator: '=', value: iterationID}],
    		fetch: ['User', 'Capacity', 'TaskEstimates', 'Load', 'Project','Iteration'],
    		autoLoad: true,
    		listeners: {
    			//TODO if doesn't exist, _loadData()
    			load: function(myStore, myData, success) {
    				
    					this._loadData(myStore,myData);
    				
    				
    			}, 
    				
    				//this._loadData,
    			scope: this
    		}
    		
    	});
    	
    	
    },
    
    
    componentCls: 'app',

    
    
    _loadData: function(store, data){
    	
    	var records = []; //Empty array to push data to
    	
    	
    	/* DEBUG -- select here if we get iteration from combobox build in app, or passed by the page */
    	//var iterationID = this.getContext().getTimeboxScope().getRecord().data.Name; //Get iteration set at the higher app level
    	//var iterationID = 'I-6-2015';
    	
    	
    	var capacity;
    	var taskEstimate;
    	var load;
    	var recordCounter = 0; //DEBUG
    	console.log('Record Counter',recordCounter); //DEBUG
    	
        // Create an array of only record where load is over 100% for the iteration
    	Ext.Array.each(data, function(record){
    		
    		load = record.get('Load');
    		iteration = record.get('Iteration')._refObjectName;
    		
    		if (load > 1 /*&& iteration === iterationID*/){
    			records.push({
    				User: record.get('User')._refObjectName,
    				Capacity: record.get('Capacity'),
    				TaskEstimate: record.get('TaskEstimates'),
    				Load: record.get('Load'),
    				Project: record.get('Project')._refObjectName,
    				Iteration: record.get('Iteration')._refObjectName
    				
    			});
    			recordCounter++;
    			console.log('Record Counter',recordCounter);
    			//TODO This returns 25 max
    			
    		};
    		
    	});
    	
    	this.myCustomStore = Ext.create('Rally.data.custom.Store',{
    		data: records
    	})
    	
    	    	
    	if(!this.myGrid) {
    	this.myGrid = Ext.create(Rally.ui.grid.Grid,{
        		store: this.myCustomStore,
        		
        		//Unclear if this layout does anything...need to fix
        		layout: {
    				type: 'fit',
    				align: 'stretch'
        		},
        		
    			columnCfgs: [
    			            {
    	        	   text: 'User', dataIndex: 'User'
    	           },
    	           {
    	        	   text: 'Load', //dataIndex: 'Load',
    	        	   xtype: 'templatecolumn',
    	        	   tpl: Ext.create('Rally.ui.renderer.template.progressbar.ProgressBarTemplate', {
    						percentDoneName: 'Load',
    						calculateColorFn: function(recordData) {
    							if (recordData.Load < 0.8) {
    								colVal = "#B2E3B6"; // Green
    							} else if (recordData.Load < 1.0) {
    								colVal = "#FBDE98"; // Orange
    							} else {
    								colVal = "#FCB5B1"; // Red
    							}
    						return colVal;
    						}
    					})
    	           },
    	           {
    	        	   text:'Task Estimates', 
    	        	   dataIndex: 'TaskEstimate', 
    	        	   align: 'center'
        		   },
    	           {
    	        	   text: 'Capacity',
    	        	   dataIndex: 'Capacity',
    	        	   align: 'center'
    	           },
    	           {
    	        	   text: 'Project',
    	        	   dataIndex: 'Project'
    	           }
               ]
        		
        	});
    	
    		console.log('grid store',this.myGrid.store);
    		
    		this.add(this.myGrid);
    	} else {
    		this.myGrid.destroy();
    		console.log('grid store',this.myGrid.store);
    		this.myGrid = Ext.create(Rally.ui.grid.Grid,{
        		store: this.myCustomStore,
        		
        		//Unclear if this layout does anything...need to fix
        		layout: {
    				type: 'fit',
    				align: 'stretch'
        		},
        		
    			columnCfgs: [
    			            {
    	        	   text: 'User', dataIndex: 'User'
    	           },
    	           {
    	        	   text: 'Load', //dataIndex: 'Load',
    	        	   xtype: 'templatecolumn',
    	        	   tpl: Ext.create('Rally.ui.renderer.template.progressbar.ProgressBarTemplate', {
    						percentDoneName: 'Load',
    						calculateColorFn: function(recordData) {
    							if (recordData.Load < 0.8) {
    								colVal = "#B2E3B6"; // Green
    							} else if (recordData.Load < 1.0) {
    								colVal = "#FBDE98"; // Orange
    							} else {
    								colVal = "#FCB5B1"; // Red
    							}
    						return colVal;
    						}
    					})
    	           },
    	           {
    	        	   text:'Task Estimates', 
    	        	   dataIndex: 'TaskEstimate', 
    	        	   align: 'center'
        		   },
    	           {
    	        	   text: 'Capacity',
    	        	   dataIndex: 'Capacity',
    	        	   align: 'center'
    	           },
    	           {
    	        	   text: 'Project',
    	        	   dataIndex: 'Project'
    	           }
               ]
        		
        	});
    	
    		    		
    		this.add(this.myGrid);

    		
    	}	
    	
    	
    	console.log('Fetched Data');
    }
    	
    	
});
