jQuery(function($){
	var buff = '';
	function setEndOfContenteditable(contentEditableElement){
		var range,selection;
		if(document.createRange){ //Firefox, Chrome, Opera, Safari, IE 9+
			range = document.createRange();//Create a range (a range is a like the selection but invisible)
			range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
			range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
			selection = window.getSelection();//get the selection object (allows you to change selection)
			selection.removeAllRanges();//remove any selections already made
			selection.addRange(range);//make the range you have just created the visible selection
		}else if(document.selection){ //IE 8 and lower
			range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
			range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
			range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
			range.select();//Select the range (make it the visible selection
		}
	};
	$('#textedit').attr('contentEditable',true).keyup(function(e){
		//BACKSPACE
		if(e.keyCode==8){
			buff=buff.substring(0,buff.length-1);
			$(this).find('span').each(function(i,v){
				if($(v).attr('length')!=$(v).text().length){
					$('form input[id="'+$(v).attr('item')+'"]').remove();
					if($(v).text().length==0)$(v).remove();
				}
			});
		}else if(String.fromCharCode(e.keyCode).match(/^([a-zA-Z0-9])$/)&&($(this).text().indexOf('@')>=0)){
			buff+=String.fromCharCode(e.keyCode);
			$(this).autocomplete('search',buff);
		}
	}).autocomplete({
		source:[
			{
				label:'apple',
				value:'1'
			},
			{
				label:'microsoft',
				value:'2'
			},
			{
				label:'linux',
				value:'3'
			},
			{
				label:'php',
				value:'4'
			},
			{
				label:'ios',
				value:'5'
			},
			{
				label:'facebook',
				value:'6'
			}
		],
		minLength:1,
		select:function(e,ui){
			$('form').append($('<input/>',{'id':ui.item.value,'name':'post','type':'hidden'}).val(ui.item.value+'|'+ui.item.label));
			$(this).html($(this).html().replace('@'+buff,'<span class="tag" length="'+ui.item.label.length+'" item="'+ui.item.value+'">'+ui.item.label+'</span>')+'&nbsp;');
			buff='';
			setEndOfContenteditable(this);
		}
	}).focus();
	$('form').submit(function(e){
		$('#output').empty().html($('#textedit').html());
		$(this).find('input:hidden').each(function(i,v){
			var vv = $(v).val().split('|');
			var o = $('#output').find('span:contains(\''+vv[1]+'\')');
			o.after($('<a/>',{'href':'?id='+vv[0]}).text(vv[1])).remove();
		});
		e.preventDefault();
	});
});