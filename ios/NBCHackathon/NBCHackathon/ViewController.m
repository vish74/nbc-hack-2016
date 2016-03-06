//
//  ViewController.m
//  ACRCloudDemo
//
//  Created by olym on 15/3/29.
//  Copyright (c) 2015年 ACRCloud. All rights reserved.
//

#import "ViewController.h"

#import "ACRCloudRecognition.h"
#import "ACRCloudConfig.h"

@interface ViewController ()

@end

@implementation ViewController
{
    ACRCloudRecognition         *_client;
    ACRCloudConfig          *_config;
    UITextView              *_resultTextView;
    NSTimeInterval          startTime;
    __block BOOL    _start;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.

    _start = NO;
    
    _config = [[ACRCloudConfig alloc] init];
    
    _config.accessKey = @"0166230120022a95f0b733003405844b";
    _config.accessSecret = @"1rRpltBgINFnugEpELFxKltEETH8LkbaDNuKn2no";
    _config.host = @"ap-southeast-1.api.acrcloud.com";
    //if you want to identify your offline db, set the recMode to "rec_mode_local"
    _config.recMode = rec_mode_remote;
    _config.audioType = @"recording";
    _config.requestTimeout = 10;
    
    /* used for local model */
    if (_config.recMode == rec_mode_local)
        _config.homedir = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"acrcloud_local_db"];
    
    __weak typeof(self) weakSelf = self;
    
    _config.stateBlock = ^(NSString *state) {
        [weakSelf handleState:state];
    };
    _config.volumeBlock = ^(float volume) {
        //do some animations with volume
        [weakSelf handleVolume:volume];
    };
    _config.resultBlock = ^(NSString *result, ACRCloudResultType resType) {
        [weakSelf handleResult:result resultType:resType];
    };
    
    _client = [[ACRCloudRecognition alloc] initWithConfig:_config];
  
  [self startRecognition];
  
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.

}

-(void)startRecognition {
    if (_start) {
        return;
    }
    self.resultView.text = @"";
    self.costLable.text = @"";
    
    [_client startRecordRec];
    _start = YES;
    
    startTime = [[NSDate date] timeIntervalSince1970];
}

- (IBAction)stopRecognition:(id)sender {
    if(_client) {
        [_client stopRecordRec];
    }
    _start = NO;
}

-(void)handleResult:(NSString *)result
         resultType:(ACRCloudResultType)resType
{
    
    
    dispatch_async(dispatch_get_main_queue(), ^{
        NSError *error = nil;
        //covert json to a pretty format
 
        self.resultView.text = result;
      NSArray *res = [result componentsSeparatedByString: @"\"name\"\:\""];
      if(res.count >1)
      {
      NSArray *res2 = [res[1] componentsSeparatedByString:@"\",\"title\":"];
      NSLog(@"%@", res2[0] );
      
    if([res2[0]  isEqual: @"MrRobot"])
    {
      self.pop.image = [UIImage imageNamed:@"MrRobot"];
    }
    else if([res2[0]  isEqual: @"Chicago Fire"])
    {
      self.pop.image = [UIImage imageNamed:@"ChigagoFire"];
    }
    else if([res2[0]  isEqual: @"TonightShowWithJimmyFallon"])
    {
      self.pop.image = [UIImage imageNamed:@"TonightShowWithJimmyFallon"];
    }
      }
      self.pop.hidden = FALSE;
        [_client stopRecordRec];
        _start = NO;
      
      [NSTimer scheduledTimerWithTimeInterval:5 target:self selector:@selector(hide) userInfo:nil repeats:FALSE];


//        NSTimeInterval nowTime = [[NSDate date] timeIntervalSince1970];
//        int cost = nowTime - startTime;
//        self.costLable.text = [NSString stringWithFormat:@"cost : %ds", cost];

    });
      
}
-(void)hide
{
  self.pop.hidden = TRUE;
  [self viewDidLoad];
}

-(void)handleVolume:(float)volume
{
    dispatch_async(dispatch_get_main_queue(), ^{
        self.volumeLable.text = [NSString stringWithFormat:@"Volume : %f",volume];
        
    });
}

-(void)handleState:(NSString *)state
{
    dispatch_async(dispatch_get_main_queue(), ^{
        self.stateLable.text = [NSString stringWithFormat:@"State : %@",state];
    });
}

@end
