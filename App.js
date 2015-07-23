Ext.define('CustomApp', {
    extend: 'Rally.app.TimeboxScopedApp',
    scopeType: 'iteration',
    
    onScopeChange: function(scope){
    	
    },
    
    
    componentCls: 'app',
    launch: function() {
    	
    	console.log('about to load');
    	
    	//Ext.create('Rally.data.WsapiDataStore',{
    	Ext.create('Rally.data.wsapi.Store',{
    		model: 'User Iteration Capacity',
    		fetch: ['User', 'Capacity', 'TaskEstimates', 'Load', 'Project','Iteration'],
    		autoLoad: true,
    		listeners: {
    			load: this._loadData,
    			scope: this
    		}
    		
    	});
    	
    },
    
    /*_createGrid: function(myStore){
    	
    	
    	this.myGrid = Ext.create(Rally.ui.grid.Grid, {
    		store: myStore,
    		columnCfgs: ['User', 'Capacity', 'TaskEstimates','Load','Project','Iteration']
    		
    	});
    	
    	console.log('Adding Grid...');
    	this.add(this.myGrid);
    	
    },*/	
    
    
    _loadData: function(store, data){
    	
    	var records = [];
    	var iterationID;
    	//var IterationID = this.getContext().getTimeboxScope().getRecord().get("ObjectID");
    	var capacity;
    	var taskEstimate;
    	var load;
    	var recordCounter = 0;
    	console.log('Record Counter',recordCounter);
    	
    	console.log('Iteration ID',iterationID);
    	
    	/*myFilters = [
            {
            	property: 'Capacity',
            	operator: '>=',
            	value: 1
            }
        ];*/
    	
    	Ext.Array.each(data, function(record){
    		load = record.get('Load');
    		iteration = record.get('Iteration')._refObjectName;
    		if (load > 1 && iteration == 'I-4-2015'){
    			records.push({
    				User: record.get('User')._refObjectName,
    				Capacity: record.get('Capacity'),
    				TaskEstimate: record.get('TaskEstimates'),
    				Load: record.get('Load'),
    				Project: record.get('Project')._refObjectName,
    				Iteration: record.get('Iteration')._refObjectName
    				
    			});
    			var username = record.get('Iteration');
    			console.log('User',username);
    			
    		};
    		recordCounter++;
    		console.log('Record Counter',recordCounter);
    	});
    	
    	this.add({
    		xtype: 'rallygrid',
    		store: Ext.create('Rally.data.custom.Store',{
    			data: records,
    			//filters: [{property: 'Iteration', operator: '=', value: 'I-3-2015'}]
    		}),
    		columnCfgs: [
	           {
	        	   text: 'User', dataIndex: 'User'
	           },
	           {
	        	   text: 'Load', dataIndex: 'Load'
	           },
	           {
	        	   text: 'Capacity', dataIndex: 'Capacity'
	           },
	           {
	        	   text: 'Project', dataIndex: 'Project'
	           },
	           {
	        	   text: 'Iteration', dataIndex: 'Iteration'
	           }
           ]
    	});
    	
    	/*this.myData = Ext.create('Rally.data.wsapi.Store',{
    		model: 'User Iteration Capacity',
    		autoLoad: true,
    		filters: myFilters,
    		listeners: {
    			load: function(myStore, myData, success){
    				this._createGrid(myStore);
    			},
    			scope: this
    		},
    		
			fetch: ['User', 'Capacity', 'TaskEstimates', 'Load', 'Project','Iteration']
    	});*/
    	console.log('Fetched Data');
    }
    	
    	
});
