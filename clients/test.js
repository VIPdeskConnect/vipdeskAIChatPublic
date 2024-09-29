document.getElementById('ymIframe').contentWindow.chat.setSkin({})
document.getElementById('ymIframe').contentWindow.chat.setSkin({
	skin: {
		allowedExtensions: [
			'jpg',
			'png',
			'gif',
			'pdf',
			'mp4',
			'mov',
			'hevc',
			'docx',
			'pptx',
			'xlsx',
			'mp3',
			'oga',
			'amr',
		],
		enableMessageFeedback: false,
		markdownEnabled: true,
		tabSession: true,
		primaryColor: '#000000',
		tertiaryColor: '#000000',
		alignLeft: true,
		showLanguageMenu: true,
		refreshContext: false,
		notificationBadge: false,
		faviconTitletext: true,
		messageSound: false,
		botIcon: 'https://cdn.yellowmessenger.com/s98npx41TnpV1727464211158.jpg',
	},
})
