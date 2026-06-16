const { Player } = require('discord-player');
const { YoutubeExtractor } = require('@discord-player/extractor');

// قائمة الآيديات المسموح لها فقط باستعمال البوت
const ALLOWED_USERS = ['1373005291880316928', '1195827812565798953'];

// آيدي الروم الصوتي اللي تبي البوت يقعد فيه دائماً
const VOICE_CHANNEL_ID = '1515484658400497725';

module.exports = (client) => {
    // إنشاء مشغل الأغاني وتثبيته في الـ client
    const player = new Player(client);

    // تسجيل مستخرج اليوتيوب
    player.extractors.register(YoutubeExtractor, {});

    // --- كود الدخول التلقائي للروم عند تشغيل البوت ---
    client.on('ready', async () => {
        console.log(`📡 جاري محاولة دخول الروم الصوتي الدائم...`);
        try {
            const channel = await client.channels.fetch(VOICE_CHANNEL_ID);
            if (channel && channel.isVoiceBased()) {
                // إنشاء اتصال بالروم الصوتي ليكون جاهزاً للاستماع والأوامر
                await player.nodes.create(channel.guild, {
                    nodeOptions: {
                        metadata: { channel: null } // سيتم تحديثه لاحقاً عند كتابة الأوامر
                    }
                });
                
                // الدخول الفعلي للروم
                const connection = await channel.connect();
                console.log(`✅ البوت متصل الآن بنجاح في الروم: ${channel.name}`);
            } else {
                console.error('❌ الآيدي المكتوب ليس لروم صوتي صحيح.');
            }
        } catch (error) {
            console.error('❌ حدث خطأ أثناء محاولة دخول الروم الصوتي تلقائياً:', error);
        }
    });

    // أحداث المشغل (Events)
    player.events.on('playerStart', (queue, track) => {
        // تأكد من وجود روم رسائل مخصص قبل الإرسال
        if (queue.metadata && queue.metadata.channel) {
            queue.metadata.channel.send(`🎵 **جاري تشغيل:** ${track.title}`);
        }
    });

    player.events.on('emptyQueue', (queue) => {
        if (queue.metadata && queue.metadata.channel) {
            queue.metadata.channel.send('📥 انتهت قائمة الانتظار.');
        }
    });

    // الاستماع للأوامر
    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.content.startsWith('!')) return;
        if (!ALLOWED_USERS.includes(message.author.id)) return;

        const args = message.content.slice(1).trim().split(/ +/);
        const command = args.shift();

        // 1. أمر التشغيل: !ش [اسم أو رابط]
        if (command === 'ش') {
            const query = args.join(' ');
            if (!query) return message.reply('❌ يرجى كتابة اسم الأغنية أو الرابط!');

            // الحين بما أن البوت قاعد بالروم، بناخذ الروم الصوتي للبوت نفسه أو للمستخدم
            const channel = message.member.voice.channel || message.guild.members.me.voice.channel;
            if (!channel) return message.reply('❌ البوت ليس في روم صوتي، ولا أنت متصل بروم حالياً!');

            try {
                const { track } = await player.play(channel, query, {
                    nodeOptions: {
                        metadata: { channel: message.channel } // هنا نحدد الروم اللي انكتب فيه الأمر عشان يرسل التنبيهات فيه
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

        // 4. أمر قفل وتصفير القائمة: !قفل (تعديل: الحين ما يطلع من الروم، بس يصفّر الأغاني)
        if (command === 'قفل') {
            const queue = player.nodes.get(message.guild.id);
            if (!queue) return message.reply('❌ ما في شيء شغال حالياً لقفله!');
            
            queue.tracks.clear(); // مسح الـ Queue
            if (queue.isPlaying()) queue.node.stop(); // إيقاف الأغنية الحالية
            return message.reply('⏹️ تم إيقاف التشغيل وتصفير قائمة الانتظار (البوت سيبقى في الروم).');
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
