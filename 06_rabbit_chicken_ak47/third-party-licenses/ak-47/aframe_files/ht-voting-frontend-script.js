jQuery(document).ready(function($) {

	
	function baseVote(value){
		
	}

	function enablePostVoting(){
		$('.ht-voting-links a').each(function( index ) {
            var voteActionAnchor = $(this);
            var targetDirection = voteActionAnchor.attr('data-direction');
            var targetType = voteActionAnchor.attr('data-type');
            var targetNonce = voteActionAnchor.attr('data-nonce');
            var targetID = voteActionAnchor.attr('data-id');
            voteActionAnchor.click(function(event){
                event.preventDefault();
                var data = {
                  	action: 'ht_voting',
                   	direction: targetDirection,
		            type: targetType,
		            nonce: targetNonce,
		            id: targetID,
                };
                $.post(voting.ajaxurl, data, function(response) {
                  if(response!=''){
                    //replace the voting box with response
                    if(targetType=="post"){
                    	$('#ht-voting-post-'+targetID).replaceWith(response);
                    }else if(targetType=="comment"){
                    	$('#ht-voting-comment-'+targetID).replaceWith(response);
                    }
                    enablePostVoting();
                  }
                });
                
            }); 

        });
    }
    //onload enable buttons
    enablePostVoting();

	

});