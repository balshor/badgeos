jQuery(document).ready(function($) {

    $('#badgeos_ach_check_all').click( function( event ) {

    	//event.preventDefault();
        $('input[name="badgeos_ach_check_indis[]"]').not(this).prop('checked', this.checked);
    });
    $('#badgeos_btn_revoke_bulk_achievements').click( function( event ) {

    	var self = $(this);
        var chkArray = [];
        var badgeos_user_id = $('#badgeos_user_id').val();
        $('input[name="badgeos_ach_check_indis[]"]:checked').each(function() {
            chkArray.push($(this).val());
        });
        var data = {
            action: 'delete_badgeos_bulk_achievements', achievements: chkArray, user_id: badgeos_user_id
        };

        self.siblings( '#revoke-badges-loader' ).show();
        $.post( admin_js.ajax_url, data, function(response) {
            self.siblings( '#revoke-badges-loader' ).hide();
        	if( response == 'success' ) {
                window.location.reload();
            } else {
                $( '#wpbody-content .wrap' ).prepend( '<div class="notice notice-warning is-dismissible"><p>'+ response+'</p></div>' );
            }
        } );
        console.log(chkArray);
    });
    function click_to_dismiss( div_id ){
        $( "#".div_id ).remove();
    }

    // Dynamically show/hide achievement meta inputs based on "Award By" selection
	$("#_badgeos_earned_by").change( function() {

		// Define our potentially unnecessary inputs
		var badgeos_sequential = $('#_badgeos_sequential').parent().parent();
		var badgeos_points_required = $('#_badgeos_points_required').parent().parent();

		// // Hide our potentially unnecessary inputs
		badgeos_sequential.hide();
		badgeos_points_required.hide();

		// Determine which inputs we should show
		if ( 'triggers' == $(this).val() )
			badgeos_sequential.show();
		else if ( 'points' == $(this).val() )
			badgeos_points_required.show();

	}).change();

	$('[href="#show-api-key"]').click( function(event) {
		event.preventDefault();
		$('#credly-settings tr, #credly-settings .toggle').toggle();
	});

	// Throw a warning on Achievement Type editor if title is > 20 characters
	$('#titlewrap').on( 'keyup', 'input[name=post_title]', function() {

		// Make sure we're editing an achievement type
		if ( 'achievement-type' == $('#post_type').val() ) {
			// Cache the title input selector
			var $title = $(this);
			if ( $title.val().length > 20 ) {
				// Set input to look like danger
				$title.css({'background':'#faa', 'color':'#a00', 'border-color':'#a55' });

				// Output a custom warning (and delete any existing version of that warning)
				$('#title-warning').remove();
				$title.parent().append('<p id="title-warning">Achievement Type supports a maximum of 20 characters. Please choose a shorter title.</p>');
			} else {
				// Set the input to standard style, hide our custom warning
				$title.css({'background':'#fff', 'color':'#333', 'border-color':'#DFDFDF'});
				$('#title-warning').remove();
			}
		}
	} );

	// Show notification custom message input if setting is enabled
	$('#credly_badge_sendemail_add_message').change( function() {
		if ( 'true' == $(this).val() )
			$('.credly-notifications-message').show();
		else
			$('.credly-notifications-message').hide();
	}).change();

	$( '#delete_log_entries' ).click( function() {
		var confirmation = confirm( 'It will delete all the log entries' );
		if( confirmation ) {
            var data = {
                'action': 'delete_badgeos_log_entries'
            };
            $.post( admin_js.ajax_url, data, function(response) {
                $( '#wpbody-content .wrap' ).prepend( '<div class="notice notice-warning delete-log-entries"><p><img src="'+ admin_js.loading_img +'" /> &nbsp;&nbsp;BadgeOS is deleting log entries as background process, you can continue exploring badgeos</p></div>' );

                setTimeout( function() {
                	$( '#wpbody-content .wrap .delete-log-entries' ).slideUp();
				}, 10000 );
            } );
		}
	});
});
