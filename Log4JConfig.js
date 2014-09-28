/*
    Log4J configurations creator
    
    Usage example on my web-page
    
    Pavel Savinov // www.pavelsavinov.info
*/

AppenderType = {
	RollingFileAppender : "org.apache.log4j.RollingFileAppender",
	ConsoleAppender		: "org.apache.log4j.ConsoleAppender"
};

Layout = {
	PatternLayout	: "org.apache.log4j.PatternLayout",
	SimpleLayout	: "org.apache.log4j.SimpleLayout",
	XMLLayout		: "org.apache.log4j.xml.XMLLayout"
};

Appender = function () {};
Appender = function (n,t,l,e,p,f,s,m){
	this.type = (typeof(t)!='undefined') ?
		t : AppenderType.ConsoleAppender;
	this.name = (typeof(n)!='undefined') ?
		n : "unknown";
	this.fileName = (typeof(f)!='undefined') ?
		f : "";
	this.fileSize = (typeof(s)!='undefined') ?
		s +"MB" : "10MB";
	this.fileMaxIndex = (typeof(m)!='undefined') ?
		m+"" : "4";
	this.layout = (typeof(l)!='undefined') ?
		l : Layout.SimpleLayout;
	this.pattern = (typeof(p)!='undefined') ?
		p : "%d{ISO8601} %-5p [%c{1}] %m%n";
	this.encoding = (typeof(e)!='undefined') ?
		e : "utf-8";
};

Appender.prototype.getProperties = function (){
	var p = "";
	var base = "log4j.appender." +
		(this.getType() == AppenderType.ConsoleAppender ?
			"ConsoleAppender" : this.getName());
	p += base + "=" + 
		this.getType() + "\r\n";
	p += base + ".encoding=" + 
		this.getEncoding() + "\r\n";
	p += base + ".layout=" + 
		this.getLayout() + "\r\n";
	if (this.getLayout() == Layout.PatternLayout){
		p += base + ".layout.ConversionPattern=" +
			this.getPattern() + "\r\n";
	}
	if (this.getType() == AppenderType.RollingFileAppender){
		p += base + ".file=" +
			this.getFileName() + "\r\n";
		p += base + ".maxFileSize=" + 
			this.getFileSize() + "\r\n";
		p += base + ".maxBackupIndex=" +
			this.getMaxIndex() + "\r\n";
	}
	p += "\r\n";
	
	return p;
};

Appender.prototype.getXML = function (){
	var name = this.getType() == AppenderType.ConsoleAppender ?
			"ConsoleAppender" : this.getName();
	var p = "<appender name=\"" + 
		this.getName() + "\" class=\"" + 
			this.getType() + "\">\r\n";
	p += "\t<param name=\"Encoding\ value=\"" +
		this.getEncoding() + "\"/>\r\n";
	if (this.getType() == AppenderType.RollingFileAppender){
		p += "\t<param name=\"File\" value=\"" + 
			this.getFileName() + "\"/>\r\n";
		p += "\t<param name=\"MaxFileSize\" value=\"" +
			this.getFileSize() + "\"/>\r\n";
		p += "\t<param name=\"MaxBackupIndex\" value=\"" +
			this.getMaxIndex() + "\"/>\r\n";
	}
	p += "\t<layout class=\"" + 
		this.getLayout() + ">\r\n";
	if (this.getLayout() == Layout.PatternLayout){
		p += "\t\t<param name=\"ConversionPattern\" value=\"" + 
			this.getPattern() + "\"/>\r\n";
	}
	p += "\t</layout>\r\n";
	p += "</appender>\r\n\r\n";
	
	return p;
};

Appender.prototype.getTarget = function (){
	return this.target;
};

Appender.prototype.isRoot = function (){
	return this.root ? this.root : false;
};

Appender.prototype.getLevel = function (){
	return this.level;
};

Appender.prototype.getEncoding = function (){
	return this.encoding;
};

Appender.prototype.getName = function (){
	return this.name;
};

Appender.prototype.getType = function (){
	return this.type;
};

Appender.prototype.getFileName = function (){
	return this.fileName;
};

Appender.prototype.getFileSize = function (){
	return this.fileSize;
};

Appender.prototype.getMaxIndex = function (){
	return this.fileMaxIndex;
};

Appender.prototype.getLayout = function (){
	return this.layout;
};

Appender.prototype.getPattern = function(){
	return this.pattern;
};

Logger = function () {};
Logger = function (a,l,t,r){
	this.appender = (typeof(a)!='undefined') ? 
		a : new Appender();
	this.level = (typeof(l)!='undefined') ?
		l : 'ALL';
	this.target = (typeof(t)!='undefined') ?
		t : 'org';
	this.root = (typeof(r)!='undefined') ?
		!!r : false;
};

Logger.prototype.isRoot = function (){
	return this.root;
};

Logger.prototype.getAppender = function (){
	return this.appender;
};

Logger.prototype.getLevel = function (){
	return this.level;
};

Logger.prototype.getTarget = function (){
	return this.target;
};

Logger.prototype.getName = function (){
	return this.getTarget();
};

Logger.prototype.getXML = function (){
	var p="";
	if (this.isRoot()){
		p += "<root>\r\n";
		p += "\t<priority value=\"" +
			this.getLevel() + "\"/>\r\n";
		p += "\t<appender-ref ref=\"" +
			this.getAppender().getName() + "\"/>\r\n";
		p += "</root>\r\n\r\n";
	} else {
		p += "<logger name=\"" +
			this.getTarget() + "\">\r\n";
		p += "\t<level value=\"" +
			this.getLevel() + "\"/>\r\n";
		p += "\t<appender-ref ref=\"" +
			this.getAppender().getName() + "\"/>\r\n";
		p += "</logger>";
	}
	return p;
};

Logger.prototype.getProperties = function (){
	var p = "";
	if (this.isRoot()){
		p +="log4j.rootLogger=" + 
			this.getLevel() + "," +
				this.getAppender().getName() + "\r\n";
	} else {
		p += "log4j.logger." + 
			this.getTarget() + "=" + 
				this.getLevel() + "," + 
					this.getAppender().getName() + "\r\n\r\n";
	}
	return p;
};

Log4JConfig = function (){};

Log4JConfig = function (l,a){
	this.loggers = l;
	this.appenders = a;
};

Log4JConfig.prototype.getAppenders = function (){
	return this.appenders;
};

Log4JConfig.prototype.getLogger = function (l){
	return this.loggers[l];
};

Log4JConfig.prototype.getAppender = function (a){
	return this.appenders[a] ;
};

Log4JConfig.prototype.editLogger = function (n,l){
	return this.loggers[n] = l;
};

Log4JConfig.prototype.editAppender = function (n,a){
	return this.appenders[n] = a ;
};

Log4JConfig.prototype.getLoggers = function (){
	return this.loggers;
};

Log4JConfig.prototype.addLogger = function(l){
	this.getLoggers()[l.getName()] = l;
};

Log4JConfig.prototype.addAppender = function(a){
	this.getAppenders()[a.getName()] = a;
};

Log4JConfig.prototype.removeLogger = function (l){
	delete this.getLoggers()[l];
};

Log4JConfig.prototype.removeAppender = function (a){
	delete this.getAppenders()[a];
};

Log4JConfig.prototype.getSettings = function (t){
	var settings = "";
	if (t == "xml"){
		settings += "<?xml encoding=\"utf-8\" version=\"1.0\"?>\r\n";
		settings += "<!DOCTYPE log4j:configuration SYSTEM \"log4j.dtd\">\r\n";
		settings += "<!-- Log4J Config by pavelsavinov.info -->";
		settings += "<log4j:configuration ";
		settings += "xmlns:log4j=\"http://jakarta.apache.org/log4j\">\r\n";
		var apps = this.getAppenders();
		var logs = this.getLoggers();
		for (var k in apps){
			if (apps[k] instanceof Appender){
				settings += apps[k].getXML();
			}
		}
		for (var k in logs){
			if (logs[k] instanceof Logger){
				settings += logs[k].getXML();
			}
		}
		settings += "</log4j:configuration>";
	} else {
		settings += "# Log4J configuration by pavelsavinov.info\r\n";
		var apps = this.getAppenders();
		var logs = this.getLoggers();
		for (var k in apps){
			if (apps[k] instanceof Appender){
				settings += apps[k].getProperties();
			}
		}
		for (var k in logs){
			if (logs[k] instanceof Logger){
				settings += logs[k].getProperties();
			}
		}
	}
	return settings;
};