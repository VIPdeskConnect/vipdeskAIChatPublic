function initChat() {
	const chatSourceCode =
		'https://cdn.yellowmessenger.com/plugin/widget-v2/latest/dist/main.min.js'
	const sessionPrefix = 'anon_jid__DARTH_VADERS__'
	const storagePrefix = 'vipdeskChat__'
	const provider = 'VIPdesk.com'

	let initialized = false
	let branded = false
	let uid

	try {
		if (!window.vipdeskBotId) return
		if (!window.chatEnabledHosts) window.chatEnabledHosts = []

		syncSession()

		window.ymConfig = window.ymConfig || {
			bot: window.vipdeskBotId,
			host: 'https://r4.cloud.yellow.ai',
			disableActionsOnLoad: true,
			disableCopyPaste: true,
			hideChatButton: true,
			persistentNotification: false,
			payload: {
				language: navigator.language.split('-')[0],
				fullLanguage: navigator.language,
				languages: navigator.languages,
				languageCount: navigator.languages.length,
				location: window.location,
			},
		}

		function loadScript() {
			if (initialized) return

			initialized = true
			const scriptElem = document.createElement('script')
			scriptElem.type = 'text/javascript'
			scriptElem.async = true
			scriptElem.src = chatSourceCode

			const scriptTag = document.getElementsByTagName('script')[0]
			scriptTag.parentNode.insertBefore(scriptElem, scriptTag)
		}

		function loadChat() {
			const ymInstance = window.YellowMessenger
			if (typeof ymInstance === 'function') {
				ymInstance('reattach_activator')
				ymInstance('update', ymConfig)
			} else {
				const ymFunction = function () {
					ymFunction.c(arguments)
				}
				ymFunction.q = []
				ymFunction.c = function (args) {
					ymFunction.q.push(args)
				}
				window.YellowMessenger = ymFunction

				window.addEventListener('load', loadScript, false)
			}

			setTimeout(() => {
				if (!initialized && document.readyState === 'complete') {
					loadScript()
				}
			}, 5000)
		}

		function removeBranding() {
			const ymIframe = document.getElementById('ymIframe')
			if (ymIframe) {
				const ymFrameBranding =
					ymIframe.contentDocument.querySelector('#ymFramebranding')
				if (ymFrameBranding) {
					const vipBranding = ymFrameBranding.cloneNode(true)
					ymFrameBranding.id = '#ymFramebrandingOld'
					ymFrameBranding.style.display = 'none'
					vipBranding.innerHTML = `Provided by ${provider}`
					// vipBranding.addEventListener('click', () => {
					// 	window.open(`https://${provider}`, '_blank')
					// })
					ymFrameBranding.parentNode.parentNode.append(vipBranding)
					branded = true
				}
			}
		}

		function chatMessageListener() {
			window.addEventListener('message', function (eventData) {
				if (eventData.data && typeof eventData.data === 'string') {
					try {
						const response = JSON.parse(eventData.data)
						console.log(response)
						if (response.event_code) {
							switch (response.event_code) {
								case 'ym_bot_id':
									uid = response.data.uid
									setCookie(`${storagePrefix}Uid`, uid)
									const chatState =
										getCookieValue(`${storagePrefix}State`) || 'closed'
									window.YellowMessengerPlugin.closeBot()

									if (chatState === 'opened') {
										window.YellowMessengerPlugin.show()
										window.YellowMessengerPlugin.openBot()
									} else if (
										!window.chatEnabledHosts.length ||
										window.chatEnabledHosts.includes(window.location.hostname)
									) {
										window.YellowMessengerPlugin.show()
									}
									break

								case 'ym-bot-closed':
									console.log('ym-bot-closed')
									setCookie(`${storagePrefix}State`, 'closed')
									if (
										!window.chatEnabledHosts.length ||
										window.chatEnabledHosts.includes(window.location.hostname)
									) {
										window.YellowMessengerPlugin.show()
									}
									break

								case 'ym-bot-opened':
									removeBranding()
									setCookie(`${storagePrefix}State`, 'opened')
									break

								default:
									break
							}

							syncSessionSet()
						}
					} catch (err) {
						console.log(err)
					}
				}
			})
		}

		function setCookie(name, value) {
			const domain = getRootDomain(window.location.hostname)
			document.cookie = `${name}=${value}; domain=.${domain}; path=/`
		}

		function getRootDomain(hostname) {
			const parts = hostname.split('.')
			if (parts.length <= 2) return hostname

			const multiPartTLDs = [
				'co.uk',
				'com.au',
				'gov.uk',
				'gov.au',
				'ac.uk',
				'org.au',
			]
			const lastTwoParts = parts.slice(-2).join('.')
			const lastThreeParts = parts.slice(-3).join('.')

			return multiPartTLDs.includes(lastTwoParts)
				? lastThreeParts
				: lastTwoParts
		}

		function getCookieValue(cookieName) {
			const name = `${cookieName}=`
			const decodedCookie = decodeURIComponent(document.cookie)
			const cookieArray = decodedCookie.split(';')

			for (const cookie of cookieArray) {
				const trimmedCookie = cookie.trim()
				if (trimmedCookie.startsWith(name)) {
					return trimmedCookie.substring(name.length)
				}
			}

			return null
		}

		function syncSession() {
			const existingSession = getCookieValue(`${storagePrefix}SessionSync`)
			if (existingSession) {
				const sessionPayload = JSON.parse(existingSession)
				Object.entries(sessionPayload).forEach(([key, value]) => {
					localStorage.setItem(key, value)
					if (key === `anon_jid__DARTH_VADERS__${window.vipdeskBotId}`) {
						uid = value
					}
				})
			}
		}

		function syncSessionSet() {
			if (!uid) return
			const keys = [
				`${sessionPrefix}${window.vipdeskBotId}`,
				`connection_type_CONNECTION_TYPE_KEY_${window.vipdeskBotId}`,
				`message_count${uid.split('@')[0]}`,
			]

			const sessionPayload = {}
			keys.forEach((key) => {
				sessionPayload[key] = localStorage.getItem(key) || undefined
			})

			setCookie(`${storagePrefix}SessionSync`, JSON.stringify(sessionPayload))
		}

		chatMessageListener()
		loadChat()
	} catch (error) {
		console.warn(
			error,
			'There was an error implementing VIPdesk Chat. Please contact support.'
		)
	}
}

initChat()
