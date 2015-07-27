Ext.define('CustomApp', {
    extend: 'Rally.app.TimeboxScopedApp',
    scopeType: 'iteration',
    componentCls: 'app',
    
    // TODO Fix the layout
    /*layout: {
    	type: 'fit',
    	align: 'stretch'
    },*/
    
    //Define what to do when iteration is changed
    onScopeChange: function(scope){
    	
    	newIteration = this._getIteration();
    	console.log('Got new iteration ID',newIteration);
    	
    	newStore = this._getFullStore(newIteration);
    	console.log('Got full store (unfiltered)',newStore);
    	
    	
    	records = this._createCustomStore(newStore);
    	console.log('Built custom store with filtered data',records);
    	
    	
    	
    	this._loadGrid(records);
    	

    },
    
    
    
    _getFullStore: function(iterationID) {
    	
    	console.log('Iteration ID',iterationID);
    	
    	//Create a data store for User Iteration Capacity records
    	this.fullStore = Ext.create('Rally.data.WsapiDataStore',{
    		model: 'User Iteration Capacity',
    		limit: 'Infinity',
    		pageSize: 200,
    		filters: [{property: 'Iteration', operator: '=', value: iterationID}],
    		fetch: ['User', 'Capacity', 'TaskEstimates', 'Load', 'Project','Iteration'],
    		autoLoad: true,
    		listeners: {
    			
    		}
    		
    	});
    	return this.fullStore;
    },
    
    
    
    _createCustomStore: function(fullStore){
    	
    	//var record = fullStore.getRecords
    	var records = []; //Empty array to push data to
    	var capacity;
    	var taskEstimate;
    	var load;
    	var recordCounter = 0; //DEBUG
    	console.log('Record Counter',recordCounter); //DEBUG
    	
        // Create an array of only record where load is over 100% for the iteration
    	this.customStore = Ext.Array.each(fullStore.getRecords('Load'), function(record){
    		
    		load = record.get('Load');
    		iteration = record.get('Iteration')._refObjectName;
    		
    		if (load > 1){
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
    	
    	return records;
    	
    	/*this.add({
    		xtype: 'rallygrid',
    		store: Ext.create('Rally.data.custom.Store',{
    			data: records,
    			//filters: [{property: 'Iteration', operator: '=', value: iterationID}]
    		}),
    		

    		

    	});*/
    	
    	
    	console.log('Returning records');
    },
    
    
    
    
    
    
    _getIteration: function(){
    	try {
    		var iterationID = this.getContext().getTimeboxScope().getRecord().get("_ref");
    	} catch(err) {
    		var iterationID = '/iteration/33678599188';
    	}
    	return iterationID;
    },
    
    _loadGrid: function(myRecords) {
    	this.myGrid = Ext.create('Rally.ui.grid.Grid', {
        	store: myRecords,
    		
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
    
    	
    	
});
