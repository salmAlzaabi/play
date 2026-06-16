const { Player } = require('discord-player');
const { YoutubeExtractor } = require('@discord-player/extractor');

// قائمة الآيديات المسموح لها فقط باستعمال البوت
const ALLOWED_USERS = ['1373005291880316928', '1195827812565798953'];

module.exports = (client) => {
    // إنشاء مشغل الأغاني وتثبيته في الـ client
    const player = new Player(client);

    // تسجيل مستخرج اليوتيوب
    player.extractors.register(YoutubeExtractor, {});

    // أحداث المشغل (Events)
    player.events.on('playerStart', (queue, track) => {
        queue.metadata.channel.send(`🎵 **جاري تشغيل:** ${track.title}`);
    });

    player.events.on('emptyQueue', (queue) => {
        queue.metadata.channel.send('📥 انتهت قائمة الانتظار.');
    });

    // الاستماع للأوامر داخل نفس الملف
    client.on('messageCreate', async (message) => {
        // تجاهل رسائل البوتات أو الرسائل التي لا تبدأ بالبريفكس حقك
        if (message.author.bot || !message.content.startsWith('!')) return;

        // التحقق من الآيديات المسموح لها فقط
        if (!ALLOWED_USERS.includes(message.author.id)) return;

        const args = message.content.slice(1).trim().split(/ +/);
        const command = args.shift();

        // 1. أمر التشغيل: !ش [اسم أو رابط]
        if (command === 'ش') {
            const query = args.join(' ');
            if (!query) return message.reply('❌ يرجى كتابة اسم الأغنية أو الرابط!');

            const channel = message.member.voice.channel;
            if (!channel) return message.reply('❌ لازم تكون في روم صوتي أولاً!');

            try {
                const { track } = await player.play(channel, query, {
                    nodeOptions: {
                        metadata: { channel: message.channel }
                    }
                });

                const queue = player.nodes.get(message.guild.id);
                if (queue && queue.isPlaying() && queue.tracks.size > 0) {
                    return message.reply(`⏳ تم إضافة **${track.title}** إلى قائمة الانتظار.`);
                }
            } catch (e) {
                console.error(e);
                return message.reply('❌ حدث خطأ أثناء محاولة تشغيل الصوت.');
            }
        }

        // 2. أمر الوقف المؤقت: !وقف
        if (command === 'وقف') {
            const queue = player.nodes.get(message.guild.id);
            if (!queue || !queue.isPlaying()) return message.reply('❌ ما في شيء شغال حالياً!');
            
            queue.node.setPaused(true);
            return message.reply('⏸️ تم إيقاف التشغيل مؤقتاً.');
        }

        // 3. أمر إكمال التشغيل: !كمل
        if (command === 'كمل') {
            const queue = player.nodes.get(message.guild.id);
            if (!queue || !queue.node.isPaused()) return message.reply('❌ البوت مو موقّف مؤقتاً!');
            
            queue.node.setPaused(false);
            return message.reply('▶️ تم استئناف التشغيل.');
        }

        // 4. أمر قفل والخروج: !قفل
        if (command === 'قفل') {
            const queue = player.nodes.get(message.guild.id);
            if (!queue) return message.reply('❌ البوت مو متصل بروم صوتي أصلاً!');
            
            queue.delete();
            return message.reply('⏹️ تم إيقاف كل شيء والخروج من الروم.');
        }

        // 5. أمر التخطي: !سكب
        if (command === 'سكب') {
            const queue = player.nodes.get(message.guild.id);
            if (!queue || !queue.isPlaying()) return message.reply('❌ ما في شيء شغال حالياً عشان أتخطاه!');
            
            queue.node.skip();
            return message.reply('⏭️ تم تخطي الأغنية الحالية.');
        }

        // 6. أمر التكرار: !تكرار
        if (command === 'تكرار') {
            const queue = player.nodes.get(message.guild.id);
            if (!queue || !queue.isPlaying()) return message.reply('❌ ما في شيء شغال حالياً عشان أكرره!');

            const isLooping = queue.repeatMode === 1;
            queue.setRepeatMode(isLooping ? 0 : 1);

            return message.reply(isLooping ? '➡️ **تم إيقاف وضع التكرار**' : '🔂 **تم تفعيل وضع التكرار للأغنية الحالية**');
        }
    });
};
