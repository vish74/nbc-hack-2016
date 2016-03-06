//
//  ListenViewController.swift
//  NBCHackathon
//
//  Created by Lucas Farah on 3/6/16.
//  Copyright © 2016 Lucas Farah. All rights reserved.
//

import UIKit

class ListenViewController: UIViewController {

	var client: ACRCloudRecognition?
	var config: ACRCloudConfig?
	var startTime: NSTimeInterval?
	var start: Bool?

	override func viewDidLoad() {
		super.viewDidLoad()

    let vc = ViewController()
    vc.viewDidLoad()
//    vc.load()
	}

	override func didReceiveMemoryWarning() {
		super.didReceiveMemoryWarning()
		// Dispose of any resources that can be recreated.
	}

	/*
	 // MARK: - Navigation

	 // In a storyboard-based application, you will often want to do a little preparation before navigation
	 override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
	 // Get the new view controller using segue.destinationViewController.
	 // Pass the selected object to the new view controller.
	 }
	 */
}
