Ext.define('CustomApp', {
    extend: 'Rally.app.TimeboxScopedApp',
    scopeType: 'iteration',
    
    onScopeChange: function(scope){
    	
    },
    
    
    componentCls: 'app',
    launch: function() {
    	
    	console.log('about to load');
    	this._loadData();
    	//
    },
    
    _createGrid: function(myStore){
    	
    	
    	this.myGrid = Ext.create(Rally.ui.grid.Grid, {
    		store: myStore,
    		columnCfgs: ['User', 'Capacity', 'TaskEstimates','Load','Project','Iteration']
    		
    	});
    	
    	console.log('Adding Grid...');
    	this.add(this.myGrid);
    	
    },	
    
    
    _loadData: function(){
    	
    	//var IterationID = this.getContext().getTimeboxScope().getRecord().get("ObjectID");
    	var IterationID = 33678599203;
    	console.log('Iteration ID',IterationID);
    	
    	myFilters = [
            {
            	property: 'Iteration',
            	operation: '=',
            	value: 33678599203            	
            }
        ];
    	
    	this.myData = Ext.create('Rally.data.wsapi.Store',{
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
    	});
    	console.log('Fetched Data');
    }
    	
    	
});
